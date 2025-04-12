import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TransferPositionByAccountDto,
  TransferPositionByBookDto,
  TransferPositionByTagDto,
  TransferType,
} from './dto/transfer-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}
  async transferPositionByBook(dto: TransferPositionByBookDto) {
    const position = await this.prisma.tb_position.findUnique({
      where: { id: dto.positionId },
    });

    if (!position) throw new NotFoundException('Position not found');

    await this.prisma.tb_position_history.create({
      data: {
        position_id: position.id,
        recorded_at: new Date(),
        price: position.price,
        NMV: position.NMV ?? 0,
        daily_pnl: position.daily_pnl,
        mtd_pnl: position.mtd_pnl,
        ytd_pnl: position.ytd_pnl,
        fair_value: position.fair_value,
        last_busday_fair_value: position.last_busday_fair_value,
      },
    });

    return this.prisma.tb_position.update({
      where: { id: dto.positionId },
      data: {
        bookId: dto.newBookId,
        price:
          dto.transferType === TransferType.COST
            ? (position.price ?? 0)
            : (position.fair_value ?? 0),
        last_transfer_date: new Date(),
      },
    });
  }

  async transferPositionByAccount(dto: TransferPositionByAccountDto) {
    const position = await this.prisma.tb_position.findUnique({
      where: { id: dto.positionId },
    });

    if (!position) throw new NotFoundException('Position not found');

    await this.prisma.tb_position_history.create({
      data: {
        position_id: position.id,
        recorded_at: new Date(),
        price: position.price,
        NMV: position.NMV ?? 0,
        daily_pnl: position.daily_pnl,
        mtd_pnl: position.mtd_pnl,
        ytd_pnl: position.ytd_pnl,
        fair_value: position.fair_value,
        last_busday_fair_value: position.last_busday_fair_value,
      },
    });

    return this.prisma.tb_position.update({
      where: { id: dto.positionId },
      data: {
        accountId: dto.newAccountId,
        price:
          dto.transferType === TransferType.COST
            ? (position.price ?? 0)
            : (position.fair_value ?? 0),
        last_transfer_date: new Date(),
      },
    });
  }

  async transferPositionByTag(dto: TransferPositionByTagDto) {
    const position = await this.prisma.tb_position.findUnique({
      where: { id: dto.positionId },
    });

    if (!position) throw new NotFoundException('Position not found');

    const tagExists = await this.prisma.tb_position.findFirst({
      where: { tag_ids: { has: dto.tagId } },
    });

    if (!tagExists) throw new NotFoundException('Tag not found');

    await this.prisma.tb_position_history.create({
      data: {
        position_id: position.id,
        recorded_at: new Date(),
        price: position.price ?? 0,
        NMV: position.NMV ?? 0,
        daily_pnl: position.daily_pnl,
        mtd_pnl: position.mtd_pnl,
        ytd_pnl: position.ytd_pnl,
        fair_value: position.fair_value,
        last_busday_fair_value: position.last_busday_fair_value,
      },
    });

    return this.prisma.tb_position.update({
      where: { id: dto.positionId },
      data: {
        tag_ids: [dto.tagId],
        price:
          dto.transferType === TransferType.COST
            ? (position.price ?? 0)
            : (position.fair_value ?? 0),
        last_transfer_date: new Date(),
      },
    });
  }

  async getPnlByDate(date: string) {
    return await this.prisma.tb_position.findMany({
      where: { createdAt: { gte: new Date(date) } },
      select: { id: true, daily_pnl: true },
    });
  }

  async getPnlByRange(startDate: string, endDate: string) {
    return await this.prisma.tb_position.findMany({
      where: {
        createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
      },
      select: { id: true, daily_pnl: true, mtd_pnl: true, ytd_pnl: true },
    });
  }

  async getInstruments() {
    const instruments = await this.prisma.tb_instrument.findMany();
    return instruments;
  }
}
