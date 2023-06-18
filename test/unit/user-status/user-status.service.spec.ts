import { Test, TestingModule } from '@nestjs/testing';
import { UserStatusService } from '../../../src/usecase/user-status/user-status.service';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserStatusEntity } from "../../../src/usecase/user-status/entities/user-status.entity";

describe('UserStatusService', () => {
  let service: UserStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserStatusService,
        {
          provide: getRepositoryToken(UserStatusEntity),
          useValue: Repository
        }
      ],
    }).compile();

    service = module.get<UserStatusService>(UserStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
