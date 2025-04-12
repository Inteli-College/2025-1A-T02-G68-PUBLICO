/*
  Warnings:

  - You are about to drop the column `market_data_id` on the `tb_instrument` table. All the data in the column will be lost.
  - You are about to drop the `tb_equity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_equity_loan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_equity_option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_market_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_market_validator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `tb_instrument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_equity" DROP CONSTRAINT "tb_equity_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "tb_equity_loan" DROP CONSTRAINT "tb_equity_loan_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "tb_equity_option" DROP CONSTRAINT "tb_equity_option_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "tb_instrument" DROP CONSTRAINT "tb_instrument_market_data_id_fkey";

-- AlterTable
ALTER TABLE "tb_instrument" DROP COLUMN "market_data_id",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "tb_order" ADD COLUMN     "accr_method" "accrual_method" DEFAULT 'ACTUAL360',
ADD COLUMN     "comp_freq" "CompFreq" DEFAULT 'SIMPLE',
ADD COLUMN     "paymentType" "PaymentType" DEFAULT 'FixedRate',
ADD COLUMN     "payment_bdc" "PaymentBDC" DEFAULT 'MODFOLLOWING',
ADD COLUMN     "payment_frequency" "PaymentFrequency" DEFAULT 'TERM';

-- DropTable
DROP TABLE "tb_equity";

-- DropTable
DROP TABLE "tb_equity_loan";

-- DropTable
DROP TABLE "tb_equity_option";

-- DropTable
DROP TABLE "tb_market_data";

-- DropTable
DROP TABLE "tb_market_validator";
