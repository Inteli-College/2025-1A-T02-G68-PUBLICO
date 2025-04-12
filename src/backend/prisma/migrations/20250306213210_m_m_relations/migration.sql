/*
  Warnings:

  - You are about to drop the column `instrument_type` on the `tb_position` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `tb_position` table. All the data in the column will be lost.
  - You are about to drop the column `expiry_date` on the `tb_trade` table. All the data in the column will be lost.
  - You are about to drop the column `instrument_type` on the `tb_trade` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `tb_trade` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `tb_account_counterparty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrumentId` to the `tb_position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrumentId` to the `tb_trade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PARTIAL', 'FILLED', 'CANCELLED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('CALL', 'PUT');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('AMERICAN', 'EUROPEAN', 'BERMUDAN');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('CONCENTRATION', 'EXPOSURE', 'VAR', 'ISSUER', 'CUSTOM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderType" ADD VALUE 'MARKET';
ALTER TYPE "OrderType" ADD VALUE 'LIMIT';
ALTER TYPE "OrderType" ADD VALUE 'STOP';
ALTER TYPE "OrderType" ADD VALUE 'STOPLIMIT';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PriceSource" ADD VALUE 'BLOOMBERG';
ALTER TYPE "PriceSource" ADD VALUE 'REFINITIV';
ALTER TYPE "PriceSource" ADD VALUE 'MANUAL';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'RISKMANAGER';
ALTER TYPE "Role" ADD VALUE 'COMPLIANCE';

-- AlterEnum
ALTER TYPE "instrument_type" ADD VALUE 'EQUITYOPTION';

-- DropIndex
DROP INDEX "tb_position_bookId_key";

-- DropIndex
DROP INDEX "tb_position_history_position_id_key";

-- DropIndex
DROP INDEX "tb_trade_bookId_key";

-- AlterTable
ALTER TABLE "tb_account" ADD COLUMN     "riskProfileId" TEXT;

-- AlterTable
ALTER TABLE "tb_account_counterparty" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tb_position" DROP COLUMN "instrument_type",
DROP COLUMN "tag",
ADD COLUMN     "instrumentId" TEXT NOT NULL,
ADD COLUMN     "last_transfer_date" TIMESTAMP(3),
ADD COLUMN     "tag_ids" TEXT[];

-- AlterTable
ALTER TABLE "tb_trade" DROP COLUMN "expiry_date",
DROP COLUMN "instrument_type",
DROP COLUMN "tag",
ADD COLUMN     "instrumentId" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "tag_ids" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "tb_order" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "side" "OrderSide" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "remaining_qty" DOUBLE PRECISION NOT NULL,
    "tag_ids" TEXT[],
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "counterpartyId" TEXT,
    "traderId" TEXT NOT NULL,
    "orderType" "OrderType" DEFAULT 'LOAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "tb_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_compliance_rule" (
    "id" TEXT NOT NULL,
    "complianceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rule_type" "RuleType" NOT NULL,
    "param_name" TEXT NOT NULL,
    "param_value" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_compliance_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_risk_profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "var_limit" DOUBLE PRECISION NOT NULL,
    "stress_limit" DOUBLE PRECISION NOT NULL,
    "concentration_limit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_risk_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_instrument" (
    "id" TEXT NOT NULL,
    "type" "instrument_type" NOT NULL,
    "market_data_id" TEXT,
    "ticker" TEXT NOT NULL,
    "cusip" TEXT,
    "isin" TEXT,
    "sedol" TEXT,
    "exchange" TEXT,
    "currency" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_equity" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "segment" TEXT,
    "dividend_type" TEXT,

    CONSTRAINT "tb_equity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_equity_option" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "underlyingId" TEXT NOT NULL,
    "strike" DOUBLE PRECISION NOT NULL,
    "optionType" "OptionType" NOT NULL,
    "exercise" "ExerciseType" NOT NULL DEFAULT 'EUROPEAN',

    CONSTRAINT "tb_equity_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_equity_loan" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "underlyingId" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "minimum_fee" DOUBLE PRECISION,

    CONSTRAINT "tb_equity_loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_market_data" (
    "id" TEXT NOT NULL,
    "last_price" DOUBLE PRECISION NOT NULL,
    "bid" DOUBLE PRECISION,
    "ask" DOUBLE PRECISION,
    "high" DOUBLE PRECISION,
    "low" DOUBLE PRECISION,
    "volume" INTEGER,
    "close" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,

    CONSTRAINT "tb_market_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PositionTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PositionTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrderTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TradeTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TradeTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_equity_instrumentId_key" ON "tb_equity"("instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_equity_option_instrumentId_key" ON "tb_equity_option"("instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_equity_loan_instrumentId_key" ON "tb_equity_loan"("instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_tag_name_key" ON "tb_tag"("name");

-- CreateIndex
CREATE INDEX "_PositionTags_B_index" ON "_PositionTags"("B");

-- CreateIndex
CREATE INDEX "_OrderTags_B_index" ON "_OrderTags"("B");

-- CreateIndex
CREATE INDEX "_TradeTags_B_index" ON "_TradeTags"("B");

-- AddForeignKey
ALTER TABLE "tb_account" ADD CONSTRAINT "tb_account_riskProfileId_fkey" FOREIGN KEY ("riskProfileId") REFERENCES "tb_risk_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_account_counterparty" ADD CONSTRAINT "tb_account_counterparty_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "tb_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_position" ADD CONSTRAINT "tb_position_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "tb_instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_order" ADD CONSTRAINT "tb_order_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "tb_book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_order" ADD CONSTRAINT "tb_order_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "tb_instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_order" ADD CONSTRAINT "tb_order_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_order" ADD CONSTRAINT "tb_order_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "tb_counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade" ADD CONSTRAINT "tb_trade_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "tb_order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade" ADD CONSTRAINT "tb_trade_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "tb_instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_compliance_rule" ADD CONSTRAINT "tb_compliance_rule_complianceId_fkey" FOREIGN KEY ("complianceId") REFERENCES "tb_compliance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_instrument" ADD CONSTRAINT "tb_instrument_market_data_id_fkey" FOREIGN KEY ("market_data_id") REFERENCES "tb_market_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_equity" ADD CONSTRAINT "tb_equity_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "tb_instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_equity_option" ADD CONSTRAINT "tb_equity_option_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "tb_instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_equity_loan" ADD CONSTRAINT "tb_equity_loan_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "tb_instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositionTags" ADD CONSTRAINT "_PositionTags_A_fkey" FOREIGN KEY ("A") REFERENCES "tb_position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositionTags" ADD CONSTRAINT "_PositionTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tb_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderTags" ADD CONSTRAINT "_OrderTags_A_fkey" FOREIGN KEY ("A") REFERENCES "tb_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderTags" ADD CONSTRAINT "_OrderTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tb_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TradeTags" ADD CONSTRAINT "_TradeTags_A_fkey" FOREIGN KEY ("A") REFERENCES "tb_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TradeTags" ADD CONSTRAINT "_TradeTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tb_trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
