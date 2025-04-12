-- CreateEnum
CREATE TYPE "accrual_method" AS ENUM ('UNKNWON', 'D30360', 'D30360ISMA', 'ACTUAL360', 'ACTUAL365', 'ACTUAL365F', 'ACTACT', 'ACTACTISDA', 'BUS252', 'BUS252S', 'D30360SIA');

-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('ANNUAL', 'SEMIANNUAL', 'QUATERLY', 'MONTHLY', 'WEEKLY', 'BIWEEKLY', 'DAILY', 'TERM', 'DAY28', 'DAY35', 'DAY42', 'DAY91', 'DAY182');

-- CreateEnum
CREATE TYPE "PaymentBDC" AS ENUM ('NONE', 'FOLLOWING', 'FRN', 'MODFOLLOWING', 'PRECEDING', 'MODPRECEDING', 'EOM', 'EOMF', 'EOMP', 'THIRDWED', 'EOMMODF', 'EOMMP');

-- CreateEnum
CREATE TYPE "instrument_type" AS ENUM ('EQUITY', 'EQUITYLOAN', 'EQUITYFORWARD', 'EQUITYFUTURE', 'CASH');

-- CreateEnum
CREATE TYPE "CompFreq" AS ENUM ('DAILY', 'QUARTERLY', 'SEMIANNUAL', 'MONTHLY', 'ANNUAL', 'SIMPLE', 'CONTINUOUS', 'WEEKLY');

-- CreateEnum
CREATE TYPE "TxnType" AS ENUM ('BUY', 'SELL', 'BUYTOCOVER', 'SELLSHORT');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('FixedRate', 'FloatingRate');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('BORROW', 'UNWINDBORROW', 'UNWINDLOAN', 'LOAN');

-- CreateEnum
CREATE TYPE "PriceSource" AS ENUM ('ORBIX', 'IMPORTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TRADER', 'COMUM');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "region" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_userauth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_userauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "nav" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tb_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_account" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nav" DOUBLE PRECISION NOT NULL,
    "complianceId" TEXT,

    CONSTRAINT "tb_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_account_counterparty" (
    "id" TEXT NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_account_counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_book" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_position" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "counterpartyId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "instrument_type" "instrument_type" NOT NULL,
    "tag" TEXT,
    "expiry_date" TIMESTAMP(3),
    "settlement_date" TIMESTAMP(3),
    "daily_pnl" DOUBLE PRECISION NOT NULL,
    "mtd_pnl" DOUBLE PRECISION NOT NULL,
    "ytd_pnl" DOUBLE PRECISION NOT NULL,
    "fair_value" DOUBLE PRECISION,
    "last_busday_fair_value" DOUBLE PRECISION,
    "NMV" DOUBLE PRECISION,
    "source_price" "PriceSource" NOT NULL DEFAULT 'ORBIX',
    "pnl" DOUBLE PRECISION NOT NULL,
    "fees" DOUBLE PRECISION NOT NULL,
    "accountId" TEXT NOT NULL,
    "orderType" "OrderType" DEFAULT 'LOAN',
    "paymentType" "PaymentType" DEFAULT 'FixedRate',
    "accr_method" "accrual_method" DEFAULT 'ACTUAL360',
    "comp_freq" "CompFreq" DEFAULT 'SIMPLE',
    "payment_frequency" "PaymentFrequency" DEFAULT 'TERM',
    "payment_bdc" "PaymentBDC" NOT NULL DEFAULT 'MODFOLLOWING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "tb_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_position_history" (
    "id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,
    "NMV" DOUBLE PRECISION NOT NULL,
    "daily_pnl" DOUBLE PRECISION NOT NULL,
    "mtd_pnl" DOUBLE PRECISION NOT NULL,
    "ytd_pnl" DOUBLE PRECISION NOT NULL,
    "fair_value" DOUBLE PRECISION,
    "last_busday_fair_value" DOUBLE PRECISION,

    CONSTRAINT "tb_position_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_trade" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instrument_type" "instrument_type" NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "trade" "TxnType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "fees" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL,
    "trade_type" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "orderType" "OrderType" DEFAULT 'LOAN',
    "paymentType" "PaymentType" DEFAULT 'FixedRate',
    "accr_method" "accrual_method" DEFAULT 'ACTUAL360',
    "comp_freq" "CompFreq" DEFAULT 'SIMPLE',
    "payment_frequency" "PaymentFrequency" DEFAULT 'TERM',
    "payment_bdc" "PaymentBDC" NOT NULL DEFAULT 'MODFOLLOWING',

    CONSTRAINT "tb_trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_counterparty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "tb_counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_compliance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3),

    CONSTRAINT "tb_compliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_market_validator" (
    "id" TEXT NOT NULL,
    "isin" TEXT,
    "sedol" TEXT,
    "exchange" TEXT,
    "cusip" TEXT,
    "ric" TEXT,
    "bb_ticker" TEXT,
    "ccy" TEXT NOT NULL,
    "instrument_type" TEXT NOT NULL,
    "dividend_frequency" TEXT NOT NULL,
    "listed_status" BOOLEAN NOT NULL,
    "status" BOOLEAN NOT NULL,
    "issuer" TEXT NOT NULL,
    "settlement_days" INTEGER,
    "last_dividend_payment" TIMESTAMP(3),

    CONSTRAINT "tb_market_validator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_cpf_key" ON "tb_user"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tb_userauth_userId_key" ON "tb_userauth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_book_name_key" ON "tb_book"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_position_bookId_key" ON "tb_position"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_position_history_position_id_key" ON "tb_position_history"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_trade_bookId_key" ON "tb_trade"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_counterparty_name_key" ON "tb_counterparty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_counterparty_number_key" ON "tb_counterparty"("number");

-- CreateIndex
CREATE UNIQUE INDEX "tb_market_validator_isin_key" ON "tb_market_validator"("isin");

-- CreateIndex
CREATE UNIQUE INDEX "tb_market_validator_sedol_key" ON "tb_market_validator"("sedol");

-- CreateIndex
CREATE UNIQUE INDEX "tb_market_validator_cusip_key" ON "tb_market_validator"("cusip");

-- CreateIndex
CREATE UNIQUE INDEX "tb_market_validator_ric_key" ON "tb_market_validator"("ric");

-- AddForeignKey
ALTER TABLE "tb_user" ADD CONSTRAINT "tb_user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "tb_company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_userauth" ADD CONSTRAINT "tb_userauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_account" ADD CONSTRAINT "tb_account_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "tb_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_account" ADD CONSTRAINT "tb_account_complianceId_fkey" FOREIGN KEY ("complianceId") REFERENCES "tb_compliance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_account_counterparty" ADD CONSTRAINT "tb_account_counterparty_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "tb_counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_position" ADD CONSTRAINT "tb_position_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "tb_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_position" ADD CONSTRAINT "tb_position_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "tb_book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_position" ADD CONSTRAINT "tb_position_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "tb_counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_position_history" ADD CONSTRAINT "tb_position_history_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "tb_position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade" ADD CONSTRAINT "tb_trade_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "tb_book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade" ADD CONSTRAINT "tb_trade_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "tb_counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade" ADD CONSTRAINT "tb_trade_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade" ADD CONSTRAINT "tb_trade_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "tb_position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
