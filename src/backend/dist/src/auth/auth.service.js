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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    userService;
    tokenBlacklist = new Set();
    constructor(prisma, jwtService, userService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async register(dto) {
        const user = (await this.userService.validateUserByEmail(dto.email)) ||
            (await this.userService.validateUserByCPF(dto.cpf));
        if (user)
            throw Error('User already exists. Email/CPF already registered!');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);
        const new_user = await this.prisma.tb_user.create({
            data: {
                name: dto.name,
                last_name: dto.last_name,
                photo: dto.photo || '',
                email: dto.email,
                cpf: dto.cpf,
                role: dto.role,
                region: dto.region,
                status: dto.status,
                companyId: dto.companyId,
                auth: {
                    create: {
                        password: hashedPassword,
                        salt: salt,
                    },
                },
            },
            include: {
                auth: true,
            },
        });
        return {
            id: new_user.id,
            name: new_user.name,
            last_name: new_user.last_name,
            photo: new_user.photo || '',
            email: new_user.email,
            cpf: new_user.cpf,
            role: new_user.role,
            region: new_user.region,
            status: new_user.status,
            companyId: new_user.companyId || '',
            password: new_user.auth?.password || '',
        };
    }
    async login(dto) {
        const user = await this.prisma.tb_user.findUnique({
            where: { email: dto.email },
            include: { auth: true },
        });
        if (!user)
            throw new common_1.NotFoundException(`No user found for email: ${dto.email}`);
        if (!user ||
            !user.auth?.password ||
            !(await bcrypt.compare(dto.password, user.auth?.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            accessToken: this.jwtService.sign({ userId: user.id }),
        };
    }
    logout(token) {
        this.tokenBlacklist.add(token);
        return { message: 'Logout successful' };
    }
    isTokenRevoked(token) {
        return this.tokenBlacklist.has(token);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map