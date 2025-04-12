export declare enum TransferType {
    COST = "cost",
    EXECUTION = "execution"
}
export declare class TransferPositionByBookDto {
    positionId: string;
    newBookId: string;
    transferType: TransferType;
}
export declare class TransferPositionByAccountDto {
    positionId: string;
    newAccountId: string;
    transferType: TransferType;
}
export declare class TransferPositionByTagDto {
    positionId: string;
    tagId: string;
    transferType: TransferType;
}
