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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const positions_service_1 = require("./positions.service");
const transfer_position_dto_1 = require("./dto/transfer-position.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const swagger_2 = require("@nestjs/swagger");
let PositionsController = class PositionsController {
    positionsService;
    constructor(positionsService) {
        this.positionsService = positionsService;
    }
    async transferByBook(dto) {
        return this.positionsService.transferPositionByBook(dto);
    }
    async transferByTag(dto) {
        return this.positionsService.transferPositionByTag(dto);
    }
    async transferByAccount(dto) {
        return this.positionsService.transferPositionByAccount(dto);
    }
    async getInstrument() {
        return this.positionsService.getInstruments();
    }
};
exports.PositionsController = PositionsController;
__decorate([
    (0, roles_decorator_1.Roles)('COMUM', 'ADMIN', 'TRADER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_1.Post)('transfer/book'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer position between books' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Position transferred successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_position_dto_1.TransferPositionByBookDto]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "transferByBook", null);
__decorate([
    (0, roles_decorator_1.Roles)('COMUM', 'ADMIN', 'TRADER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_1.Post)('transfer/tag'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer position between tags' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Position transferred successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_position_dto_1.TransferPositionByTagDto]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "transferByTag", null);
__decorate([
    (0, roles_decorator_1.Roles)('COMUM', 'ADMIN', 'TRADER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_1.Post)('transfer/account'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer position between accounts' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Position transferred successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_position_dto_1.TransferPositionByAccountDto]),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "transferByAccount", null);
__decorate([
    (0, roles_decorator_1.Roles)('COMUM', 'ADMIN', 'TRADER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_1.Get)('get-instruments'),
    (0, swagger_1.ApiOperation)({ summary: 'Select all instruments registered on the platform' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All instruments selected',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PositionsController.prototype, "getInstrument", null);
exports.PositionsController = PositionsController = __decorate([
    (0, swagger_1.ApiTags)('Positions'),
    (0, common_1.Controller)('positions'),
    __metadata("design:paramtypes", [positions_service_1.PositionsService])
], PositionsController);
//# sourceMappingURL=positions.controller.js.map