"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionsModule = void 0;
const common_1 = require("@nestjs/common");
const positions_service_1 = require("./positions.service");
const positions_controller_1 = require("./positions.controller");
const prisma_service_1 = require("../prisma/prisma.service");
let PositionsModule = class PositionsModule {
};
exports.PositionsModule = PositionsModule;
exports.PositionsModule = PositionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [positions_controller_1.PositionsController],
        providers: [positions_service_1.PositionsService, prisma_service_1.PrismaService],
    })
], PositionsModule);
//# sourceMappingURL=positions.module.js.map