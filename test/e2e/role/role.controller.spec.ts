import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";
import { RoleController } from "../../../src/application/role/role.controller";
import { RoleService } from "../../../src/domain/services/role/role.service";
import { RoleEntity } from "../../../src/infrastructure/entities/role.entity";

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: RoleEntity
        }
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
