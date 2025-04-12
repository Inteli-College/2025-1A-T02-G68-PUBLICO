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
exports.PositionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const transfer_position_dto_1 = require("./dto/transfer-position.dto");
let PositionsService = class PositionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transferPositionByBook(dto) {
        const position = await this.prisma.tb_position.findUnique({
            where: { id: dto.positionId },
        });
        if (!position)
            throw new common_1.NotFoundException('Position not found');
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
                price: dto.transferType === transfer_position_dto_1.TransferType.COST
                    ? (position.price ?? 0)
                    : (position.fair_value ?? 0),
                last_transfer_date: new Date(),
            },
        });
    }
    async transferPositionByAccount(dto) {
        const position = await this.prisma.tb_position.findUnique({
            where: { id: dto.positionId },
        });
        if (!position)
            throw new common_1.NotFoundException('Position not found');
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
                price: dto.transferType === transfer_position_dto_1.TransferType.COST
                    ? (position.price ?? 0)
                    : (position.fair_value ?? 0),
                last_transfer_date: new Date(),
            },
        });
    }
    async transferPositionByTag(dto) {
        const position = await this.prisma.tb_position.findUnique({
            where: { id: dto.positionId },
        });
        if (!position)
            throw new common_1.NotFoundException('Position not found');
        const tagExists = await this.prisma.tb_position.findFirst({
            where: { tag_ids: { has: dto.tagId } },
        });
        if (!tagExists)
            throw new common_1.NotFoundException('Tag not found');
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
                price: dto.transferType === transfer_position_dto_1.TransferType.COST
                    ? (position.price ?? 0)
                    : (position.fair_value ?? 0),
                last_transfer_date: new Date(),
            },
        });
    }
    async getPnlByDate(date) {
        return await this.prisma.tb_position.findMany({
            where: { createdAt: { gte: new Date(date) } },
            select: { id: true, daily_pnl: true },
        });
    }
    async getPnlByRange(startDate, endDate) {
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
};
exports.PositionsService = PositionsService;
exports.PositionsService = PositionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PositionsService);
//# sourceMappingURL=positions.service.js.map