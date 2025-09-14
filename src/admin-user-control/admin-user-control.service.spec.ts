import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserControlService } from './admin-user-control.service';

describe('AdminUserControlService', () => {
  let service: AdminUserControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUserControlService],
    }).compile();

    service = module.get<AdminUserControlService>(AdminUserControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
