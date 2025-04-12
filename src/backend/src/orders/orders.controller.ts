/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { OrderStatus } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Roles('COMUM', 'ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query('bookId') bookId?: string,
    @Query('instrumentId') instrumentId?: string,
    @Query('status') status?: OrderStatus,
    @Query('traderId') traderId?: string,
  ) {
    return this.ordersService.findAll({
      bookId,
      instrumentId,
      status,
      traderId,
    });
  }

  @Roles('COMUM', 'ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles('ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Roles('ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.cancel(id);
  }

  @Roles('ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/execute')
  async executeOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() executionData: { executedQuantity: number; executedPrice: number },
  ) {
    const { executedQuantity, executedPrice } = executionData;

    if (!executedQuantity || !executedPrice) {
      throw new BadRequestException(
        'Both executedQuantity and executedPrice are required',
      );
    }

    return this.ordersService.executeOrder(id, executedQuantity, executedPrice);
  }

  @Roles('ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/allocate')
  async allocateOrder(
    @Param('id') orderId: string,
    @Body() allocations: { accountId: string; quantity: number }[],
  ) {
    return this.ordersService.allocateOrder(orderId, allocations);
  }

  @Roles('ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.delete(id);
  }
}
