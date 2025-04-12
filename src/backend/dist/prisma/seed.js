"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const path = require("path");
const xlsx = require("xlsx");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando a Seed...');
    await prisma.tb_order_allocation.deleteMany({});
    await prisma.tb_trade_allocation.deleteMany({});
    await prisma.tb_trade.deleteMany({});
    await prisma.tb_position.deleteMany({});
    await prisma.tb_order.deleteMany({});
    await prisma.tb_userauth.deleteMany({});
    await prisma.tb_user.deleteMany({});
    await prisma.tb_account_counterparty.deleteMany({});
    await prisma.tb_account.deleteMany({});
    await prisma.tb_company.deleteMany({});
    await prisma.tb_instrument.deleteMany({});
    await prisma.tb_book.deleteMany({});
    await prisma.tb_compliance.deleteMany({});
    await prisma.tb_risk_profile.deleteMany({});
    await prisma.tb_tag.deleteMany({});
    await prisma.tb_counterparty.deleteMany({});
    console.log(' Limpando DB...');
    const company = await prisma.tb_company.create({
        data: {
            name: 'Empresa Demo',
            status: true,
            nav: 500000000,
        },
    });
    console.log('✅ Empresa criada.');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('senha123', salt);
    const admin = await prisma.tb_user.create({
        data: {
            name: 'Admin',
            last_name: 'User',
            email: 'admin@demo.com',
            cpf: '12345678901',
            role: client_1.Role.ADMIN,
            region: 'Global',
            status: true,
            companyId: company.id,
        },
    });
    const trader = await prisma.tb_user.create({
        data: {
            name: 'John',
            last_name: 'Trader',
            email: 'trader@demo.com',
            cpf: '98765432100',
            role: client_1.Role.TRADER,
            region: 'Global',
            status: true,
            companyId: company.id,
        },
    });
    await prisma.tb_user.create({
        data: {
            name: 'Joana',
            last_name: 'Sadad',
            email: 'readonly@demo.com',
            cpf: '98765432120',
            role: client_1.Role.COMUM,
            region: 'Global',
            status: true,
            companyId: company.id,
        },
    });
    await prisma.tb_userauth.create({
        data: {
            userId: admin.id,
            password: hashedPassword,
            salt: salt,
        },
    });
    console.log('✅ Usuários criados.');
    const account1 = await prisma.tb_account.create({
        data: {
            id: 'account-1',
            companyId: company.id,
            status: true,
        },
    });
    const account2 = await prisma.tb_account.create({
        data: {
            id: 'account-2',
            companyId: company.id,
            status: true,
        },
    });
    console.log('✅ Contas criadas.');
    const book = await prisma.tb_book.create({
        data: {
            id: 'book-1',
            name: 'Book Principal',
            description: 'Book de negociação principal',
        },
    });
    console.log('✅ Book criado.');
    const filePath = path.join(__dirname, 'grid1_in15dhzi.xlsx');
    let instrument = null;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    for (const row of data) {
        const ticker = row['Security'];
        const description = row['Description'];
        const category = row['Category'];
        const exchange = row['Exchange'];
        instrument = await prisma.tb_instrument.create({
            data: {
                ticker: ticker,
                type: client_1.instrument_type.EQUITY,
                description: description,
                currency: 'BRL',
                category: category,
                exchange: exchange,
                status: true,
            },
        });
    }
    if (!instrument) {
        throw new Error('❌ Nenhum instrumento foi encontrado no Excel.');
    }
    console.log('✅ Instrumentos cadastrados com sucesso!');
    console.log('✅ Instrumento selecionado:', instrument);
    const order = await prisma.tb_order.create({
        data: {
            bookId: book.id,
            instrumentId: instrument.id,
            traderId: trader.id,
            side: client_1.OrderSide.BUY,
            quantity: 100,
            price: 150,
            remaining_qty: 100,
            status: client_1.OrderStatus.PENDING,
            orderType: client_1.OrderType.MARKET,
            paymentType: client_1.PaymentType.FixedRate,
            accr_method: client_1.accrual_method.ACTUAL360,
            comp_freq: client_1.CompFreq.ANNUAL,
            payment_frequency: client_1.PaymentFrequency.QUATERLY,
            payment_bdc: client_1.PaymentBDC.MODFOLLOWING,
        },
    });
    console.log('✅ Ordem criada.');
    await prisma.tb_order_allocation.createMany({
        data: [
            { orderId: order.id, accountId: account1.id, quantity: 50 },
            { orderId: order.id, accountId: account2.id, quantity: 50 },
        ],
    });
    console.log('✅ Alocações criadas.');
    await prisma.tb_position.create({
        data: {
            bookId: book.id,
            accountId: account1.id,
            instrumentId: instrument.id,
            price: 150,
            daily_pnl: 0,
            mtd_pnl: 0,
            ytd_pnl: 0,
            pnl: 0,
            fees: 0,
            status: true,
        },
    });
    console.log('✅ Posição criada.');
    let position = await prisma.tb_position.findFirst({
        where: {
            bookId: book.id,
            instrumentId: instrument.id,
        },
    });
    if (!position) {
        position = await prisma.tb_position.create({
            data: {
                bookId: book.id,
                accountId: account1.id,
                instrumentId: instrument.id,
                price: 150,
                daily_pnl: 0,
                mtd_pnl: 0,
                ytd_pnl: 0,
                pnl: 0,
                fees: 0,
                status: true,
            },
        });
    }
    console.log('✅ Trade criado.');
    console.log('🌱 Seed finalizada com sucesso!');
}
main()
    .catch((e) => {
    console.error('Erro na Seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map