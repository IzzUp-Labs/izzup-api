import { RoleService } from "../../../src/usecase/role/role.service";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RoleDto } from "../../../src/usecase/role/dto/role.dto";
import { RoleEntity } from "../../../src/usecase/role/entities/role.entity";

describe('RoleService', () => {
  let service: RoleService;
  let repository: Repository<RoleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(RoleEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repository = module.get<Repository<RoleEntity>>(
      getRepositoryToken(RoleEntity),
    );
  });

  describe('create', () => {
    it('should create a role', async () => {
      const roleDto: RoleDto = { name: 'test' };
      const createdRole: RoleEntity = { id: 1, name: 'test' };

      jest.spyOn(repository, 'create').mockReturnValue(createdRole);
      jest.spyOn(repository, 'save').mockResolvedValue(createdRole);

      const result = await service.create(roleDto);

      expect(result).toEqual(createdRole);
    });
  });

  describe('findOne', () => {
    it('should find a role by fields', async () => {
      const fields: { id: number } = { id: 1 };
      const foundRole: RoleEntity = { id: 1, name: 'test' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(foundRole);

      const result = await service.findOne(fields);

      expect(result).toEqual(foundRole);
    });
  });

  describe('findAll', () => {
    it('should find all roles', async () => {
      const foundRoles: RoleEntity[] = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(foundRoles);

      const result = await service.findAll();

      expect(result).toEqual(foundRoles);
    });
  });

  describe('delete', () => {
    it('should delete a role by id', async () => {
      const id = 1;
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
      const result = await service.delete(id);
      expect(result).toBeUndefined();
    });
  });
});