import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceController } from './customer-service.controller';

describe('CustomerServiceController', () => {
  let controller: CustomerServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerServiceController],
    }).compile();

    controller = module.get<CustomerServiceController>(CustomerServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
