import { Test, TestingModule } from "@nestjs/testing";
import { UserStatusController } from "../../../src/usecase/user-status/user-status.controller";
import { UserStatusService } from "../../../src/usecase/user-status/user-status.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserStatusEntity } from "../../../src/usecase/user-status/entities/user-status.entity";

describe("UserStatusController", () => {
  let controller: UserStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStatusController],
      providers: [
        UserStatusService,
        {
          provide: getRepositoryToken(UserStatusEntity),
          useValue: Repository
        }
      ]
    }).compile();

    controller = module.get<UserStatusController>(UserStatusController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
