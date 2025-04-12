/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PositionsService } from './positions.service';
import {
  TransferPositionByBookDto,
  TransferPositionByTagDto,
  TransferPositionByAccountDto,
} from './dto/transfer-position.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Roles('COMUM', 'ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('transfer/book')
  @ApiOperation({ summary: 'Transfer position between books' })
  @ApiResponse({
    status: 200,
    description: 'Position transferred successfully',
  })
  async transferByBook(@Body() dto: TransferPositionByBookDto) {
    return this.positionsService.transferPositionByBook(dto);
  }

  @Roles('COMUM', 'ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('transfer/tag')
  @ApiOperation({ summary: 'Transfer position between tags' })
  @ApiResponse({
    status: 200,
    description: 'Position transferred successfully',
  })
  async transferByTag(@Body() dto: TransferPositionByTagDto) {
    return this.positionsService.transferPositionByTag(dto);
  }

  @Roles('COMUM', 'ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('transfer/account')
  @ApiOperation({ summary: 'Transfer position between accounts' })
  @ApiResponse({
    status: 200,
    description: 'Position transferred successfully',
  })
  async transferByAccount(@Body() dto: TransferPositionByAccountDto) {
    return this.positionsService.transferPositionByAccount(dto);
  }

  @Roles('COMUM', 'ADMIN', 'TRADER')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('get-instruments')
  @ApiOperation({ summary: 'Select all instruments registered on the platform' })
  @ApiResponse({
    status: 200,
    description: 'All instruments selected',
  })
  async getInstrument() {
    return this.positionsService.getInstruments();
  }
}
