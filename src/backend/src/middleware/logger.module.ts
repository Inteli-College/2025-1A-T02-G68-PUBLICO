import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
