"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(dto) {
        const instrument = await this.prisma.tb_instrument.findUnique({
            where: { id: dto.instrumentId },
        });
        if (!instrument) {
            throw new common_1.NotFoundException('Instrument not found');
        }
        const book = await this.prisma.tb_book.findUnique({
            where: { id: dto.bookId },
        });
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        if (dto.counterpartyId) {
            const counterparty = await this.prisma.tb_counterparty.findUnique({
                where: { id: dto.counterpartyId },
            });
            if (!counterparty) {
                throw new common_1.NotFoundException('Counterparty not found');
            }
        }
        const order = await this.prisma.tb_order.create({
            data: {
                bookId: dto.bookId,
                instrumentId: dto.instrumentId,
                side: dto.side,
                quantity: dto.quantity,
                price: dto.price,
                remaining_qty: dto.quantity,
                status: client_1.OrderStatus.PENDING,
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
    async findAll(filters) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, dto) {
        const order = await this.prisma.tb_order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.status === client_1.OrderStatus.FILLED ||
            order.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException(`Cannot update order with status ${order.status}`);
        }
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
    async allocateOrder(orderId, allocations) {
        const order = await this.prisma.tb_order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const totalAllocated = allocations.reduce((sum, a) => sum + a.quantity, 0);
        if (totalAllocated > order.quantity) {
            throw new common_1.BadRequestException(`Total allocation (${totalAllocated}) exceeds order quantity (${order.quantity})`);
        }
        for (const allocation of allocations) {
            const account = await this.prisma.tb_account.findUnique({
                where: { id: allocation.accountId },
            });
            if (!account) {
                throw new common_1.BadRequestException(`Invalid account: ${allocation.accountId}`);
            }
        }
        await this.prisma.tb_order_allocation.createMany({
            data: allocations.map((a) => ({
                orderId,
                accountId: a.accountId,
                quantity: a.quantity,
            })),
        });
        return { message: 'Allocations registered successfully', allocations };
    }
    async cancel(id) {
        const order = await this.prisma.tb_order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Order is already cancelled');
        }
        if (order.status === client_1.OrderStatus.FILLED) {
            throw new common_1.BadRequestException('Cannot cancel a filled order');
        }
        return this.prisma.tb_order.update({
            where: { id },
            data: {
                status: client_1.OrderStatus.CANCELLED,
                updatedAt: new Date(),
            },
        });
    }
    async executeOrder(id, executedQuantity, executedPrice) {
        const order = await this.prisma.tb_order.findUnique({
            where: { id },
            include: {
                allocations: true,
                instrument: true,
                book: true,
                trader: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (!order.allocations.length) {
            throw new common_1.BadRequestException(`Order must have allocations before execution.`);
        }
        if (executedQuantity <= 0 || executedQuantity > order.remaining_qty) {
            throw new common_1.BadRequestException(`Invalid execution quantity. Remaining: ${order.remaining_qty}, Requested: ${executedQuantity}`);
        }
        return this.prisma.$transaction(async (prisma) => {
            const trades = [];
            for (const allocation of order.allocations) {
                const allocatedQty = Math.round((allocation.quantity / order.quantity) * executedQuantity);
                if (allocatedQty === 0)
                    continue;
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
                }
                else {
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
                const trade = await prisma.tb_trade.create({
                    data: {
                        id: crypto.randomUUID(),
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
                    },
                });
                await prisma.tb_trade_allocation.create({
                    data: {
                        tradeId: trade.id,
                        accountId: allocation.accountId,
                        quantity: allocatedQty,
                    },
                });
                trades.push(trade);
            }
            const newRemainingQty = order.remaining_qty - executedQuantity;
            const newStatus = newRemainingQty > 0 ? client_1.OrderStatus.PARTIAL : client_1.OrderStatus.FILLED;
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
    async delete(id) {
        const order = await this.prisma.tb_order.findUnique({
            where: { id },
            include: { trades: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.trades && order.trades.length > 0) {
            throw new common_1.BadRequestException('Cannot delete an order with associated trades');
        }
        if (order.status !== client_1.OrderStatus.PENDING &&
            order.status !== client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException(`Cannot delete order with status ${order.status}`);
        }
        return this.prisma.tb_order.delete({
            where: { id },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map