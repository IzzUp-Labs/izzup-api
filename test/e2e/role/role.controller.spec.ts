import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RoleController } from "../../../src/usecase/role/role.controller";
import { RoleService } from "../../../src/usecase/role/role.service";
import { RoleEntity } from "../../../src/usecase/role/entities/role.entity";

describe("RoleController", () => {
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
      ]
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
