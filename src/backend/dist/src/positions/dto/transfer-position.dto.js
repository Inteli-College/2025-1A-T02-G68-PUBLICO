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
exports.TransferPositionByTagDto = exports.TransferPositionByAccountDto = exports.TransferPositionByBookDto = exports.TransferType = void 0;
const class_validator_1 = require("class-validator");
var TransferType;
(function (TransferType) {
    TransferType["COST"] = "cost";
    TransferType["EXECUTION"] = "execution";
})(TransferType || (exports.TransferType = TransferType = {}));
class TransferPositionByBookDto {
    positionId;
    newBookId;
    transferType;
}
exports.TransferPositionByBookDto = TransferPositionByBookDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferPositionByBookDto.prototype, "positionId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferPositionByBookDto.prototype, "newBookId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(TransferType, {
        message: 'transferType must be either cost or execution',
    }),
    __metadata("design:type", String)
], TransferPositionByBookDto.prototype, "transferType", void 0);
class TransferPositionByAccountDto {
    positionId;
    newAccountId;
    transferType;
}
exports.TransferPositionByAccountDto = TransferPositionByAccountDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferPositionByAccountDto.prototype, "positionId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferPositionByAccountDto.prototype, "newAccountId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(TransferType, {
        message: 'transferType must be either cost or execution',
    }),
    __metadata("design:type", String)
], TransferPositionByAccountDto.prototype, "transferType", void 0);
class TransferPositionByTagDto {
    positionId;
    tagId;
    transferType;
}
exports.TransferPositionByTagDto = TransferPositionByTagDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferPositionByTagDto.prototype, "positionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferPositionByTagDto.prototype, "tagId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(TransferType, {
        message: 'transferType must be either cost or execution',
    }),
    __metadata("design:type", String)
], TransferPositionByTagDto.prototype, "transferType", void 0);
//# sourceMappingURL=transfer-position.dto.js.map