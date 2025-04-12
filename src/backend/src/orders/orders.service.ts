/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    // Verificar se o instrumento existe
    const instrument = await this.prisma.tb_instrument.findUnique({
      where: { id: dto.instrumentId },
    });

    if (!instrument) {
      throw new NotFoundException('Instrument not found');
    }

    // Verificar se o book existe
    const book = await this.prisma.tb_book.findUnique({
      where: { id: dto.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Verificar contraparte se existir
    if (dto.counterpartyId) {
      const counterparty = await this.prisma.tb_counterparty.findUnique({
        where: { id: dto.counterpartyId },
      });

      if (!counterparty) {
        throw new NotFoundException('Counterparty not found');
      }
    }

    // Criar ordem
    const order = await this.prisma.tb_order.create({
      data: {
        bookId: dto.bookId,
        instrumentId: dto.instrumentId,
        side: dto.side,
        quantity: dto.quantity,
        price: dto.price,
        remaining_qty: dto.quantity,
        status: OrderStatus.PENDING,
        counterpartyId: dto.counterpartyId,
        traderId: dto.traderId,
        orderType: dto.orderType,
        expiryDate: dto.expiryDate,
        tag_ids: dto.tag_ids || [],
      },
    });

    const allocations = dto.allocations.map((allocation) => ({
      orderId: order.id,
      accountId: allocation.accountId,
      quantity: allocation.quantity,
    }));

    // Associar tags se fornecidas
    if (dto.tag_ids && dto.tag_ids.length > 0) {
      await this.prisma.tb_order.update({
        where: { id: order.id },
        data: {
          tags: {
            connect: dto.tag_ids.map((tagId) => ({ id: tagId })),
          },
        },
      });
    }

    await this.prisma.tb_order_allocation.createMany({ data: allocations });

    return { order, allocations };
  }

  async findAll(filters?: {
    bookId?: string;
    instrumentId?: string;
    status?: OrderStatus;
    traderId?: string;
  }) {
    return this.prisma.tb_order.findMany({
      where: {
        ...(filters?.bookId && { bookId: filters.bookId }),
        ...(filters?.instrumentId && { instrumentId: filters.instrumentId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.traderId && { traderId: filters.traderId }),
      },
      include: {
        book: true,
        instrument: true,
        counterparty: true,
        trader: true,
        trades: true,
        tags: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.tb_order.findUnique({
      where: { id },
      include: {
        book: true,
        instrument: true,
        counterparty: true,
        trader: true,
        trades: true,
        tags: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    // Verificar se a ordem existe
    const order = await this.prisma.tb_order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Verificar se a ordem já foi executada ou cancelada
    if (
      order.status === OrderStatus.FILLED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot update order with status ${order.status}`,
      );
    }

    // Atualizar ordem
    const updatedOrder = await this.prisma.tb_order.update({
      where: { id },
      data: {
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.quantity !== undefined && {
          quantity: dto.quantity,
          remaining_qty: dto.quantity - (order.quantity - order.remaining_qty),
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.counterpartyId !== undefined && {
          counterpartyId: dto.counterpartyId,
        }),
        ...(dto.expiryDate !== undefined && { expiryDate: dto.expiryDate }),
        updatedAt: new Date(),
      },
      include: {
        book: true,
        instrument: true,
        counterparty: true,
        trader: true,
        trades: true,
        tags: true,
      },
    });

    // Atualizar tags se fornecidas
    if (dto.tag_ids) {
      await this.prisma.tb_order.update({
        where: { id },
        data: {
          tags: {
            set: dto.tag_ids.map((tagId) => ({ id: tagId })),
          },
          tag_ids: dto.tag_ids,
        },
      });
    }

    return updatedOrder;
  }

  async allocateOrder(
    orderId: string,
    allocations: { accountId: string; quantity: number }[],
  ) {
    const order = await this.prisma.tb_order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validar soma das alocações
    const totalAllocated = allocations.reduce((sum, a) => sum + a.quantity, 0);
    if (totalAllocated > order.quantity) {
      throw new BadRequestException(
        `Total allocation (${totalAllocated}) exceeds order quantity (${order.quantity})`,
      );
    }

    // Validar se as contas pertencem ao trader
    for (const allocation of allocations) {
      const account = await this.prisma.tb_account.findUnique({
        where: { id: allocation.accountId },
      });

      if (!account) {
        throw new BadRequestException(
          `Invalid account: ${allocation.accountId}`,
        );
      }
    }

    // Criar alocações
    await this.prisma.tb_order_allocation.createMany({
      data: allocations.map((a) => ({
        orderId,
        accountId: a.accountId,
        quantity: a.quantity,
      })),
    });

    return { message: 'Allocations registered successfully', allocations };
  }

  async cancel(id: string) {
    // Verificar se a ordem existe
    const order = await this.prisma.tb_order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Verificar se a ordem já foi cancelada ou completamente executada
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === OrderStatus.FILLED) {
      throw new BadRequestException('Cannot cancel a filled order');
    }

    // Cancelar ordem
    return this.prisma.tb_order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });
  }

  async executeOrder(
    id: string,
    executedQuantity: number,
    executedPrice: number,
  ) {
    const order = await this.prisma.tb_order.findUnique({
      where: { id },
      include: {
        allocations: true, // Verifica se a ordem já tem alocações definidas
        instrument: true,
        book: true,
        trader: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Se não houver alocações, impedir a execução
    if (!order.allocations.length) {
      throw new BadRequestException(
        `Order must have allocations before execution.`,
      );
    }

    // Verificar se a quantidade a ser executada é válida
    if (executedQuantity <= 0 || executedQuantity > order.remaining_qty) {
      throw new BadRequestException(
        `Invalid execution quantity. Remaining: ${order.remaining_qty}, Requested: ${executedQuantity}`,
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      const trades: Prisma.tb_tradeUncheckedCreateInput[] = [];

      // Processar cada alocação proporcionalmente
      for (const allocation of order.allocations) {
        // Calcular a quantidade proporcional para cada conta
        const allocatedQty = Math.round(
          (allocation.quantity / order.quantity) * executedQuantity,
        );

        if (allocatedQty === 0) continue; // Ignorar contas com alocação zero

        // Buscar ou criar a posição para essa conta e instrumento
        let position = await prisma.tb_position.findFirst({
          where: {
            accountId: allocation.accountId,
            instrumentId: order.instrumentId,
          },
        });

        if (!position) {
          position = await prisma.tb_position.create({
            data: {
              accountId: allocation.accountId,
              bookId: order.bookId,
              instrumentId: order.instrumentId,
              price: executedPrice,
              tag_ids: order.tag_ids,
              daily_pnl: 0,
              mtd_pnl: 0,
              ytd_pnl: 0,
              pnl: 0,
              fees: 0,
              status: true,
              counterpartyId: order.counterpartyId,
            },
          });
        } else {
          // Atualizar posição existente (ajustar preço médio)
          const oldQty = position.NMV ? position.NMV / position.price : 0;
          const direction = order.side === 'BUY' ? 1 : -1;
          const newQty = oldQty + allocatedQty * direction;

          let newAvgPrice = position.price;
          if (newQty !== 0) {
            const oldValue = oldQty * position.price;
            const newValue = allocatedQty * executedPrice * direction;
            newAvgPrice = Math.abs((oldValue + newValue) / newQty);
          }

          position = await prisma.tb_position.update({
            where: { id: position.id },
            data: {
              price: newAvgPrice,
              NMV: newQty * newAvgPrice,
              updatedAt: new Date(),
            },
          });
        }

        // Criar o trade para essa conta
        const trade = await prisma.tb_trade.create({
          data: {
            id: crypto.randomUUID(), // Opcional se `id` for `@default(uuid())`
            orderId: order.id,
            bookId: order.bookId,
            positionId: position.id,
            instrumentId: order.instrumentId,
            trade: order.side === 'BUY' ? 'BUY' : 'SELL',
            quantity: allocatedQty,
            price: executedPrice,
            counterpartyId: order.counterpartyId || '',
            traderId: order.traderId,
            fees: 0,
            status: true,
            trade_type: order.orderType || 'MARKET',
            orderType: order.orderType,
            paymentType: order.paymentType,
            accr_method: order.accr_method,
            comp_freq: order.comp_freq,
            payment_frequency: order.payment_frequency,
            payment_bdc: order.payment_bdc,
            createdAt: new Date(),
            updatedAt: new Date(),
            tag_ids: order.tag_ids || [],
          } as Prisma.tb_tradeUncheckedCreateInput,
        });

        // Criar a alocação do trade
        await prisma.tb_trade_allocation.create({
          data: {
            tradeId: trade.id,
            accountId: allocation.accountId,
            quantity: allocatedQty,
          },
        });

        trades.push(trade);
      }

      // 🔹 Atualizar a ordem
      const newRemainingQty = order.remaining_qty - executedQuantity;
      const newStatus =
        newRemainingQty > 0 ? OrderStatus.PARTIAL : OrderStatus.FILLED;

      const updatedOrder = await prisma.tb_order.update({
        where: { id },
        data: {
          remaining_qty: newRemainingQty,
          status: newStatus,
        },
      });

      return { trades, updatedOrder };
    });
  }

  async delete(id: string) {
    // Verificar se a ordem existe
    const order = await this.prisma.tb_order.findUnique({
      where: { id },
      include: { trades: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Verificar se a ordem tem trades associados
    if (order.trades && order.trades.length > 0) {
      throw new BadRequestException(
        'Cannot delete an order with associated trades',
      );
    }

    // Deletar ordem apenas se estiver em PENDING ou CANCELLED
    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot delete order with status ${order.status}`,
      );
    }

    return this.prisma.tb_order.delete({
      where: { id },
    });
  }
}
