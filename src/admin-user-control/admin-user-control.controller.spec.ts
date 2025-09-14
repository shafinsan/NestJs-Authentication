import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserControlController } from './admin-user-control.controller';

describe('AdminUserControlController', () => {
  let controller: AdminUserControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminUserControlController],
    }).compile();

    controller = module.get<AdminUserControlController>(AdminUserControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
