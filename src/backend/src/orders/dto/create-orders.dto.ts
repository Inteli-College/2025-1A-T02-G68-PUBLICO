/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDate,
  IsArray,
  Min,
  ValidateIf,
} from 'class-validator';
import { OrderSide, OrderType } from '@prisma/client';
import { Type } from 'class-transformer';

export class OrderAllocationDto {
  @IsUUID()
  accountId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  bookId: string;

  @IsUUID()
  instrumentId: string;

  @IsEnum(OrderSide)
  side: OrderSide;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.orderType !== OrderType.MARKET)
  price?: number;

  @IsOptional()
  @IsArray()
  tag_ids?: string[];

  @IsUUID()
  @IsOptional()
  counterpartyId?: string;

  @IsUUID()
  traderId: string;

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @IsArray()
  allocations: OrderAllocationDto[];
}
