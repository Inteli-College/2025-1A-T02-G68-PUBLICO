/*
  Warnings:

  - You are about to drop the column `nav` on the `tb_account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_account" DROP COLUMN "nav";

-- AlterTable
ALTER TABLE "tb_order" ADD COLUMN     "accountId" TEXT;

-- CreateTable
CREATE TABLE "tb_order_allocation" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_order_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_trade_allocation" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "tb_trade_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_trade_allocation_tradeId_key" ON "tb_trade_allocation"("tradeId");

-- AddForeignKey
ALTER TABLE "tb_order_allocation" ADD CONSTRAINT "tb_order_allocation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "tb_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_order_allocation" ADD CONSTRAINT "tb_order_allocation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "tb_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade_allocation" ADD CONSTRAINT "tb_trade_allocation_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "tb_trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_trade_allocation" ADD CONSTRAINT "tb_trade_allocation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "tb_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
