import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../src/domain/services/user/user.service";
import { Repository } from "typeorm";
import { UserEntity } from "../../../src/infrastructure/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EntityCondition } from "../../../src/domain/utils/types/entity-condition.type";
import { AuthRegisterDto } from "../../../src/application/auth/dto/auth-register.dto";

describe("UserService", () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({
                id: 1,
                email: "test@example.com",
                password: "password",
                last_name: "lasttest",
                first_name: "firsttest",
                created_at: new Date("2023-04-02T13:15:43.636Z"),
                updated_at: new Date("2023-04-02T13:15:43.636Z")
              }
            ),
            delete: jest.fn()
          }
        }
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
        created_at: new Date("2023-04-02T13:15:43.636Z"),
        updated_at: new Date("2023-04-02T13:15:43.636Z")
      };
      const createUserDto: AuthRegisterDto = {
        email: "test@test.com",
        password: "password"
      };

      const userRepositorySaveSpy = jest
        .spyOn(repository, "save")
        .mockResolvedValueOnce(mockUser);

      const result = await service.create(createUserDto);

      expect(userRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      const users = [
        { id: 1, email: "test1@example.com", password: "password" },
        { id: 2, email: "test2@example.com", password: "password" }
      ];
      jest.spyOn(repository, "find").mockResolvedValueOnce(users as any);
      const result = await service.findAll();
      expect(result).toEqual(users);
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
      const updateUserDto = { email: "newtest@example.com" };
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
