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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateUserByEmail(email) {
        const user = await this.prisma.tb_user.findUnique({
            where: { email },
            include: { auth: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user ? true : false;
    }
    async findOne(id) {
        const user = await this.prisma.tb_user.findUnique({
            where: { id },
            include: { auth: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return new user_entity_1.UserEntity();
    }
    async validateUserByCPF(cpf) {
        const user = await this.prisma.tb_user.findUnique({
            where: { cpf },
            include: { auth: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user ? true : false;
    }
    async remove(id) {
        const user = await this.prisma.tb_user.findUnique({
            where: { id },
            include: { auth: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.tb_user.delete({
            where: {
                id,
            },
        });
        return new user_entity_1.UserEntity();
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map