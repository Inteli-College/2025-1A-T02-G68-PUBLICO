import {
  accrual_method,
  CompFreq,
  instrument_type,
  OrderType,
  PaymentBDC,
  PaymentFrequency,
  PaymentType,
  TxnType,
} from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class BasePositionDto {
  @IsUUID()
  bookId: string;

  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  counterpartyId?: string;

  @IsEnum(instrument_type)
  instrument_type: instrument_type;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsNumber()
  fees: number;

  @IsOptional()
  @IsNumber()
  fair_value?: number;
}

export class EquityLoanPositionDto extends BasePositionDto {
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsEnum(accrual_method)
  accr_method: accrual_method;

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(CompFreq)
  comp_freq: CompFreq;

  @IsEnum(PaymentFrequency)
  payment_frequency: PaymentFrequency;

  @IsEnum(PaymentBDC)
  payment_bdc: PaymentBDC;

  @IsOptional()
  expiry_date?: Date;

  @IsOptional()
  settlement_date?: Date;
}

export class EquityForwardPositionDto extends BasePositionDto {
  @IsOptional()
  expiry_date?: Date;

  @IsOptional()
  settlement_date?: Date;
}

export class EquityLoanTradeDto extends EquityLoanPositionDto {
  @IsEnum(TxnType)
  txn_type: TxnType;
}

export class EquityForwardTradeDto extends EquityForwardPositionDto {
  @IsEnum(TxnType)
  txn_type: TxnType;
}

export class EquityTradeDto extends BasePositionDto {
  @IsEnum(TxnType)
  txn_type: TxnType;
}
