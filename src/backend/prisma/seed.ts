/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  accrual_method,
  CompFreq,
  instrument_type,
  OrderSide,
  OrderStatus,
  OrderType,
  PaymentBDC,
  PaymentFrequency,
  PaymentType,
  PrismaClient,
  Role,
  tb_instrument,
} from '@prisma/client';
import * as path from 'path';
import * as xlsx from 'xlsx';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface InstrumentData {
  Security: string;
  Description: string;
  Category: string;
  Exchange: string;
}

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

  // Criar Empresa
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
      role: Role.ADMIN,
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
      role: Role.TRADER,
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
      role: Role.COMUM,
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

  // Criar Contas
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

  // Criar um Book
  const book = await prisma.tb_book.create({
    data: {
      id: 'book-1',
      name: 'Book Principal',
      description: 'Book de negociação principal',
    },
  });

  console.log('✅ Book criado.');

  // Criar um Instrumento
  const filePath = path.join(__dirname, 'grid1_in15dhzi.xlsx');

  let instrument: tb_instrument | null = null;

  // Carregar o arquivo Excel
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data: InstrumentData[] = xlsx.utils.sheet_to_json(
    workbook.Sheets[sheetName],
  );

  for (const row of data) {
    const ticker = row['Security'];
    const description = row['Description'];
    const category = row['Category'];
    const exchange = row['Exchange'];

    instrument = await prisma.tb_instrument.create({
      data: {
        ticker: ticker,
        type: instrument_type.EQUITY,
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

  // Criar uma Ordem
  const order = await prisma.tb_order.create({
    data: {
      bookId: book.id,
      instrumentId: instrument.id,
      traderId: trader.id,
      side: OrderSide.BUY,
      quantity: 100,
      price: 150,
      remaining_qty: 100,
      status: OrderStatus.PENDING,
      orderType: OrderType.MARKET,
      paymentType: PaymentType.FixedRate,
      accr_method: accrual_method.ACTUAL360,
      comp_freq: CompFreq.ANNUAL,
      payment_frequency: PaymentFrequency.QUATERLY,
      payment_bdc: PaymentBDC.MODFOLLOWING,
    },
  });

  console.log('✅ Ordem criada.');

  // Criar alocações da ordem para contas
  await prisma.tb_order_allocation.createMany({
    data: [
      { orderId: order.id, accountId: account1.id, quantity: 50 },
      { orderId: order.id, accountId: account2.id, quantity: 50 },
    ],
  });

  console.log('✅ Alocações criadas.');

  // Criar uma Posição
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

  // Criar um Trade
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

// Executar a Seed
main()
  .catch((e) => {
    console.error('Erro na Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
