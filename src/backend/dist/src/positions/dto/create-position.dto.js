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
exports.EquityTradeDto = exports.EquityForwardTradeDto = exports.EquityLoanTradeDto = exports.EquityForwardPositionDto = exports.EquityLoanPositionDto = exports.BasePositionDto = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class BasePositionDto {
    bookId;
    accountId;
    counterpartyId;
    instrument_type;
    price;
    tag;
    fees;
    fair_value;
}
exports.BasePositionDto = BasePositionDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BasePositionDto.prototype, "bookId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BasePositionDto.prototype, "accountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BasePositionDto.prototype, "counterpartyId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.instrument_type),
    __metadata("design:type", String)
], BasePositionDto.prototype, "instrument_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BasePositionDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BasePositionDto.prototype, "tag", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BasePositionDto.prototype, "fees", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BasePositionDto.prototype, "fair_value", void 0);
class EquityLoanPositionDto extends BasePositionDto {
    paymentType;
    accr_method;
    orderType;
    comp_freq;
    payment_frequency;
    payment_bdc;
    expiry_date;
    settlement_date;
}
exports.EquityLoanPositionDto = EquityLoanPositionDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PaymentType),
    __metadata("design:type", String)
], EquityLoanPositionDto.prototype, "paymentType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.accrual_method),
    __metadata("design:type", String)
], EquityLoanPositionDto.prototype, "accr_method", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.OrderType),
    __metadata("design:type", String)
], EquityLoanPositionDto.prototype, "orderType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.CompFreq),
    __metadata("design:type", String)
], EquityLoanPositionDto.prototype, "comp_freq", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PaymentFrequency),
    __metadata("design:type", String)
], EquityLoanPositionDto.prototype, "payment_frequency", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PaymentBDC),
    __metadata("design:type", String)
], EquityLoanPositionDto.prototype, "payment_bdc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], EquityLoanPositionDto.prototype, "expiry_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], EquityLoanPositionDto.prototype, "settlement_date", void 0);
class EquityForwardPositionDto extends BasePositionDto {
    expiry_date;
    settlement_date;
}
exports.EquityForwardPositionDto = EquityForwardPositionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], EquityForwardPositionDto.prototype, "expiry_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], EquityForwardPositionDto.prototype, "settlement_date", void 0);
class EquityLoanTradeDto extends EquityLoanPositionDto {
    txn_type;
}
exports.EquityLoanTradeDto = EquityLoanTradeDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TxnType),
    __metadata("design:type", String)
], EquityLoanTradeDto.prototype, "txn_type", void 0);
class EquityForwardTradeDto extends EquityForwardPositionDto {
    txn_type;
}
exports.EquityForwardTradeDto = EquityForwardTradeDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TxnType),
    __metadata("design:type", String)
], EquityForwardTradeDto.prototype, "txn_type", void 0);
class EquityTradeDto extends BasePositionDto {
    txn_type;
}
exports.EquityTradeDto = EquityTradeDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TxnType),
    __metadata("design:type", String)
], EquityTradeDto.prototype, "txn_type", void 0);
//# sourceMappingURL=create-position.dto.js.map