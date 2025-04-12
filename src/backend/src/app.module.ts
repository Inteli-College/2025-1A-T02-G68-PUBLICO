import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PositionsModule } from './positions/positions.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReconciliationModule } from './reconciliation/reconciliation.module';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { LoggerModule } from './middleware/logger.module';

@Module({
  imports: [
    PrismaModule,
    ReconciliationModule,
    AuthModule,
    PositionsModule,
    UserModule,
    LoggerModule,
    OrdersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
