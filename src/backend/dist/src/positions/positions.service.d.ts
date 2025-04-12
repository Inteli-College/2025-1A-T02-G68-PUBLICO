import { PrismaService } from 'src/prisma/prisma.service';
import { TransferPositionByAccountDto, TransferPositionByBookDto, TransferPositionByTagDto } from './dto/transfer-position.dto';
export declare class PositionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    transferPositionByBook(dto: TransferPositionByBookDto): Promise<{
        id: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        instrumentId: string;
        accountId: string;
        price: number;
        tag_ids: string[];
        counterpartyId: string | null;
        orderType: import(".prisma/client").$Enums.OrderType | null;
        paymentType: import(".prisma/client").$Enums.PaymentType | null;
        accr_method: import(".prisma/client").$Enums.accrual_method | null;
        comp_freq: import(".prisma/client").$Enums.CompFreq | null;
        payment_frequency: import(".prisma/client").$Enums.PaymentFrequency | null;
        payment_bdc: import(".prisma/client").$Enums.PaymentBDC;
        expiry_date: Date | null;
        settlement_date: Date | null;
        daily_pnl: number;
        mtd_pnl: number;
        ytd_pnl: number;
        fair_value: number | null;
        last_busday_fair_value: number | null;
        NMV: number | null;
        last_transfer_date: Date | null;
        source_price: import(".prisma/client").$Enums.PriceSource;
        pnl: number;
        fees: number;
    }>;
    transferPositionByAccount(dto: TransferPositionByAccountDto): Promise<{
        id: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        instrumentId: string;
        accountId: string;
        price: number;
        tag_ids: string[];
        counterpartyId: string | null;
        orderType: import(".prisma/client").$Enums.OrderType | null;
        paymentType: import(".prisma/client").$Enums.PaymentType | null;
        accr_method: import(".prisma/client").$Enums.accrual_method | null;
        comp_freq: import(".prisma/client").$Enums.CompFreq | null;
        payment_frequency: import(".prisma/client").$Enums.PaymentFrequency | null;
        payment_bdc: import(".prisma/client").$Enums.PaymentBDC;
        expiry_date: Date | null;
        settlement_date: Date | null;
        daily_pnl: number;
        mtd_pnl: number;
        ytd_pnl: number;
        fair_value: number | null;
        last_busday_fair_value: number | null;
        NMV: number | null;
        last_transfer_date: Date | null;
        source_price: import(".prisma/client").$Enums.PriceSource;
        pnl: number;
        fees: number;
    }>;
    transferPositionByTag(dto: TransferPositionByTagDto): Promise<{
        id: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
        bookId: string;
        instrumentId: string;
        accountId: string;
        price: number;
        tag_ids: string[];
        counterpartyId: string | null;
        orderType: import(".prisma/client").$Enums.OrderType | null;
        paymentType: import(".prisma/client").$Enums.PaymentType | null;
        accr_method: import(".prisma/client").$Enums.accrual_method | null;
        comp_freq: import(".prisma/client").$Enums.CompFreq | null;
        payment_frequency: import(".prisma/client").$Enums.PaymentFrequency | null;
        payment_bdc: import(".prisma/client").$Enums.PaymentBDC;
        expiry_date: Date | null;
        settlement_date: Date | null;
        daily_pnl: number;
        mtd_pnl: number;
        ytd_pnl: number;
        fair_value: number | null;
        last_busday_fair_value: number | null;
        NMV: number | null;
        last_transfer_date: Date | null;
        source_price: import(".prisma/client").$Enums.PriceSource;
        pnl: number;
        fees: number;
    }>;
    getPnlByDate(date: string): Promise<{
        id: string;
        daily_pnl: number;
    }[]>;
    getPnlByRange(startDate: string, endDate: string): Promise<{
        id: string;
        daily_pnl: number;
        mtd_pnl: number;
        ytd_pnl: number;
    }[]>;
    getInstruments(): Promise<{
        id: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.instrument_type;
        ticker: string;
        cusip: string | null;
        isin: string | null;
        sedol: string | null;
        exchange: string | null;
        category: string;
        currency: string;
    }[]>;
}
