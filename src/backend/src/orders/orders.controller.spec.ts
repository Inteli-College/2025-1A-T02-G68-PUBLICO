import { Test, TestingModule } from '@nestjs/testing';
import { MarketController } from './orders.controller';
import { MarketService } from './orders.service';

describe('MarketController', () => {
  let controller: MarketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketController],
      providers: [MarketService],
    }).compile();

    controller = module.get<MarketController>(MarketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
