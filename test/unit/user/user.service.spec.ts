import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../src/usecase/user/user.service";
import { Repository } from "typeorm";
import { UserEntity } from "../../../src/usecase/user/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EntityCondition } from "../../../src/domain/utils/types/entity-condition.type";
import { CreateUserDto } from "../../../src/usecase/user/dto/create-user.dto";
import {UpdateUserDto} from "../../../src/usecase/user/dto/update-user.dto";
import { UserStatusEnum } from "../../../src/domain/utils/enums/user-status.enum";
import { UserStatusService } from "../../../src/usecase/user-status/user-status.service";
import { UserStatusEntity } from "../../../src/usecase/user-status/entities/user-status.entity";
import { ConfigService } from "@nestjs/config";
import { FileExtensionChecker } from "../../../src/domain/utils/file-extension-checker/file-extension-checker";

describe("UserService", () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserStatusService,
        ConfigService,
        FileExtensionChecker,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({
              id: 1,
              email: 'test@example.com',
              password: 'password',
              last_name: "lasttest",
              first_name: "firsttest",
              role: 'EXTRA',
              created_at: new Date("2023-04-02T13:15:43.636Z"),
              updated_at: new Date("2023-04-02T13:15:43.636Z"),
            }
            ),
            delete: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(UserStatusEntity),
          useValue: Repository
        },
        {
          provide: 'FIREBASE_TOKEN',
          useValue: 'FIREBASE_TOKEN',
        },
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const mockUser: UserEntity = {
        id: 1,
        email: "test@example.com",
        password: "password",
        last_name: "lasttest",
        first_name: "firsttest",
        photo: null,
        role: 'EXTRA',
        id_photo: null,
        rooms: [],
        date_of_birth: new Date("2015-08-02T13:15:43.636Z"),
        created_at: new Date("2023-04-02T13:15:43.636Z"),
        updated_at: new Date("2023-04-02T13:15:43.636Z"),
        deleted_at: null,
        employer: null,
        extra: null,
        statuses: [{id: 1, name: UserStatusEnum.UNVERIFIED}]
      };
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "password",
        last_name: "lasttest",
        first_name: "firsttest",
        date_of_birth: new Date(),
        role: 'EXTRA',
        employer: null,
        extra: null,
      };

      const userRepositorySaveSpy = jest
        .spyOn(repository, "save")
        .mockResolvedValueOnce(mockUser);

      const result = await service.create(createUserDto);

      expect(userRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe("findOne", () => {
    it("should find and return a user by fields", async () => {
      const fields: EntityCondition<UserEntity> = { email: "test@example.com" };
      const user = { id: 1, email: "test@example.com", password: "password" };
      jest.spyOn(repository, "findOne").mockResolvedValueOnce(user as any);
      const result = await service.findOne(fields);
      expect(result).toEqual(user);
    });
  });

  describe("update", () => {
    it("should update and return a user by id and update dto", async () => {
      const id = 1;
      const updateUserDto : UpdateUserDto = { email: "newtest@example.com" };
      const user = { id, email: "newtest@example.com", password: "password" };
      jest.spyOn(repository, "save").mockResolvedValueOnce(user as any);
      const result = await service.update(id, updateUserDto);
      expect(result).toEqual(user);
    });
  });

  describe("remove", () => {
    it("should delete a user by id", async () => {
      const id = 1;
      jest.spyOn(repository, "delete").mockResolvedValueOnce(undefined as any);
      const result = await service.remove(id);
      expect(result).toBeUndefined();
    });
  });
});
