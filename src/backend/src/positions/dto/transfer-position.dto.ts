import { IsUUID, IsEnum, IsString } from 'class-validator';

export enum TransferType {
  COST = 'cost',
  EXECUTION = 'execution',
}

export class TransferPositionByBookDto {
  @IsUUID()
  positionId: string;

  @IsUUID()
  newBookId: string;

  @IsEnum(TransferType, {
    message: 'transferType must be either cost or execution',
  })
  transferType: TransferType;
}

export class TransferPositionByAccountDto {
  @IsUUID()
  positionId: string;

  @IsUUID()
  newAccountId: string;

  @IsEnum(TransferType, {
    message: 'transferType must be either cost or execution',
  })
  transferType: TransferType;
}

export class TransferPositionByTagDto {
  @IsUUID()
  positionId: string;

  @IsString()
  tagId: string;

  @IsEnum(TransferType, {
    message: 'transferType must be either cost or execution',
  })
  transferType: TransferType;
}
