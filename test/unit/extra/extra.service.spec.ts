import { Repository } from "typeorm";import { Test, TestingModule } from "@nestjs/testing";import { getRepositoryToken } from "@nestjs/typeorm";import { EntityCondition } from "../../../src/domain/utils/types/entity-condition.type";import { ExtraService } from "../../../src/usecase/extra/extra.service";import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";import { ExtraDto } from "../../../src/usecase/extra/dto/extra.dto";import { TagEntity } from "../../../src/usecase/tag/entities/tag.entity";describe("ExtraService", () => {  let service: ExtraService;  let repository: Repository<ExtraEntity>;  beforeEach(async () => {    const module: TestingModule = await Test.createTestingModule({      providers: [        ExtraService,        {          provide: getRepositoryToken(ExtraEntity),          useValue: {            findOne: jest.fn(),            find: jest.fn(),            save: jest.fn(),            create: jest.fn().mockReturnValue({                id: 1,                user_id: 1,                date_of_birth: new Date("2023-04-02T13:15:43.636Z"),                address: "123 Test Street",                created_at: new Date(),                updated_at: new Date(),                deleted_at: new Date(),              }            ),            delete: jest.fn()          }        },        {          provide: getRepositoryToken(TagEntity),          useValue: {            findOne: jest.fn().mockReturnValue({              id: 1,              name: "test",              color: "red",             }            ),          }        }      ]    }).compile();    service = module.get<ExtraService>(ExtraService);    repository = module.get<Repository<ExtraEntity>>(      getRepositoryToken(ExtraEntity)    );  });  describe("create", () => {    it("should create a new extra", async () => {      const mockExtra: ExtraEntity = {        id: 1,        user_id: 1,        address: "123 Test Street",        created_at: new Date(),        updated_at: new Date(),        deleted_at: new Date(),        tags: []      };      const createExtraDto: ExtraDto = {        user_id: 1,        address: "123 Test Street"      };      const extraRepositorySaveSpy = jest        .spyOn(repository, "save")        .mockResolvedValueOnce(mockExtra);      const result = await service.create(createExtraDto);      expect(extraRepositorySaveSpy).toHaveBeenCalledTimes(1);      expect(result).toEqual(mockExtra);    });  });  describe("findAll", () => {    it("should return all extras", async () => {      const extras = [        {          id: 1,          user_id: 1,          address: "123 Test Street",          created_at: new Date(),          updated_at: new Date(),          deleted_at: new Date(),        },        {          id: 2,          user_id: 2,          address: "321 Test Street",          created_at: new Date(),          updated_at: new Date(),          deleted_at: new Date(),        }      ];      jest.spyOn(repository, "find").mockResolvedValueOnce(extras as any);      const result = await service.findAll();      expect(result).toEqual(extras);    });  });  describe("findOne", () => {    it("should find and return a extra by fields", async () => {      const fields: EntityCondition<ExtraEntity> = { id: 1 };      const extra = {        id: 1,        user_id: 1,        address: "123 Test Street",        created_at: new Date(),        updated_at: new Date(),        deleted_at: new Date(),      };      jest.spyOn(repository, "findOne").mockResolvedValueOnce(extra as any);      const result = await service.findOne(fields);      expect(result).toEqual(extra);    });  });  describe("update", () => {    it("should update and return a user by id and update dto", async () => {      const id = 1;      const updateUserDto = { address: "new address" };      const extra = {        id: 1,        user_id: 1,        address: "123 Test Street",        created_at: new Date(),        updated_at: new Date(),        deleted_at: new Date(),      };      jest.spyOn(repository, "save").mockResolvedValueOnce(extra as any);      const result = await service.update(id, updateUserDto);      expect(result).toEqual(extra);    });  });  describe("remove", () => {    it("should delete a user by id", async () => {      const id = 1;      jest.spyOn(repository, "delete").mockResolvedValueOnce(undefined as any);      const result = await service.remove(id);      expect(result).toBeUndefined();    });  });  describe("extra tags", () => {    it("should add multiple tags to a extra", async () => {      const fields: EntityCondition<ExtraEntity> = { id: 1 };      const extra : ExtraEntity = {        id: 1,        user_id: 1,        address: "123 Test Street",        created_at: new Date(),        updated_at: new Date(),        deleted_at: new Date(),        tags: []      };      const updatedExtra : ExtraEntity = {        id: 1,        user_id: 1,        address: "123 Test Street",        created_at: new Date(),        updated_at: new Date(),        deleted_at: new Date(),        tags: [          {          id: 1,          name: "test",          color: "red"        },          {            id: 2,            name: "test2",            color: "blue"          }]      }      const tags = [        {          id: 1,          name: "test",          color: "red"        },        {          id: 2,          name: "test2",          color: "blue"        }];      jest.spyOn(repository, "findOne").mockResolvedValueOnce(extra as any);      jest.spyOn(repository, "save").mockResolvedValueOnce(updatedExtra as any);      const result = await service.addTags(fields, tags);      expect(result).toEqual(updatedExtra);    });  });});