import { accrual_method, CompFreq, instrument_type, OrderType, PaymentBDC, PaymentFrequency, PaymentType, TxnType } from '@prisma/client';
export declare class BasePositionDto {
    bookId: string;
    accountId: string;
    counterpartyId?: string;
    instrument_type: instrument_type;
    price: number;
    tag?: string;
    fees: number;
    fair_value?: number;
}
export declare class EquityLoanPositionDto extends BasePositionDto {
    paymentType: PaymentType;
    accr_method: accrual_method;
    orderType: OrderType;
    comp_freq: CompFreq;
    payment_frequency: PaymentFrequency;
    payment_bdc: PaymentBDC;
    expiry_date?: Date;
    settlement_date?: Date;
}
export declare class EquityForwardPositionDto extends BasePositionDto {
    expiry_date?: Date;
    settlement_date?: Date;
}
export declare class EquityLoanTradeDto extends EquityLoanPositionDto {
    txn_type: TxnType;
}
export declare class EquityForwardTradeDto extends EquityForwardPositionDto {
    txn_type: TxnType;
}
export declare class EquityTradeDto extends BasePositionDto {
    txn_type: TxnType;
}
