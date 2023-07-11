import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../../../src/usecase/user/user.controller";
import { UserService } from "../../../src/usecase/user/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../../src/usecase/user/entities/user.entity";
import { UserStatusEntity } from "../../../src/usecase/user-status/entities/user-status.entity";
import { Repository } from "typeorm";
import { UserStatusService } from "../../../src/usecase/user-status/user-status.service";
import { ParamCheckService } from "../../../src/domain/middleware/param-check/param-check.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { FileExtensionChecker } from "../../../src/domain/utils/file-extension-checker/file-extension-checker";
import { SocketService } from "../../../src/usecase/app-socket/socket.service";
import { AppSocketSessionEntity } from "../../../src/usecase/app-socket/entities/app-socket-session.entity";

describe("UserController", () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserStatusService,
        ParamCheckService,
        JwtService,
        ConfigService,
        FileExtensionChecker,
        SocketService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: UserEntity
        },
        {
          provide: getRepositoryToken(UserStatusEntity),
          useValue: Repository
        },
        {
          provide: getRepositoryToken(AppSocketSessionEntity),
          useValue: AppSocketSessionEntity
        },
        {
          provide: "FIREBASE_TOKEN",
          useValue: "FIREBASE_TOKEN"
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
