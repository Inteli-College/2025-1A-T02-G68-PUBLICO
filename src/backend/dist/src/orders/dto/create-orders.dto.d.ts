import { OrderSide, OrderType } from '@prisma/client';
export declare class OrderAllocationDto {
    accountId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    bookId: string;
    instrumentId: string;
    side: OrderSide;
    quantity: number;
    price?: number;
    tag_ids?: string[];
    counterpartyId?: string;
    traderId: string;
    orderType: OrderType;
    expiryDate?: Date;
    allocations: OrderAllocationDto[];
}
