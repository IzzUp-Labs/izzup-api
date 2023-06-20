import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../../../src/usecase/user/user.controller";
import { UserService } from "../../../src/usecase/user/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../../src/usecase/user/entities/user.entity";
import { UserStatusEntity } from "../../../src/usecase/user-status/entities/user-status.entity";
import { Repository } from "typeorm";
import { UserStatusService } from "../../../src/usecase/user-status/user-status.service";

describe("UserController", () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserStatusService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: UserEntity
        },
        {
          provide: getRepositoryToken(UserStatusEntity),
          useValue: Repository
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
