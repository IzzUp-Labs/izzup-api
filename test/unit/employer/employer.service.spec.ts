import { EmployerService } from "../../../src/domain/services/employer/employer.service";
import { Repository } from "typeorm";
import { EmployerEntity } from "../../../src/infrastructure/entities/employer.entity";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmployerDto } from "../../../src/application/employer/dto/employer.dto";
import { EntityCondition } from "../../../src/domain/utils/types/entity-condition.type";

describe('EmployerService', () => {
  let service: EmployerService;
  let employerRepository: Repository<EmployerEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmployerService,
        {
          provide: getRepositoryToken(EmployerEntity),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              relation: jest.fn(() => ({
                of: jest.fn(() => ({
                  add: jest.fn(),
                })),
              })),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<EmployerService>(EmployerService);
    employerRepository = module.get<Repository<EmployerEntity>>(
      getRepositoryToken(EmployerEntity)
    );
  });

  describe('create', () => {
    it('should create an employer', async () => {
      const employer : EmployerEntity = {
        id: 1,
        user_id: 1,
        date_of_birth: new Date(),
        updated_at: new Date(),
      };
      const mockEmployer : EmployerDto = {
        user_id: 1,
        date_of_birth: new Date(),
      }

      const employerRepositorySaveSpy = jest
        .spyOn(employerRepository, 'save')
        .mockResolvedValueOnce(employer);

      const result = await service.create(mockEmployer);

      expect(employerRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(employer);
    });
  });

  describe('findAll', () => {
    it('should return an array of employers', async () => {
      const employer : EmployerEntity = {
        id: 1,
        user_id: 1,
        date_of_birth: new Date(),
        updated_at: new Date(),
      };

      const employerRepositoryFindSpy = jest
        .spyOn(employerRepository, 'find')
        .mockResolvedValueOnce([employer]);

      const result = await service.findAll();

      expect(employerRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual([employer]);
    });
  });

  describe('findOne', () => {
    it('should return an employer', async () => {
      const field: EntityCondition<EmployerEntity> = { id: 1 };
      const employer : EmployerEntity = {
        id: 1,
        user_id: 1,
        date_of_birth: new Date(),
        updated_at: new Date(),
      };

      const employerRepositoryFindOneSpy = jest
        .spyOn(employerRepository, 'findOne')
        .mockResolvedValueOnce(employer);

      const result = await service.findOne(field);

      expect(employerRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(employer);
    });
  });

  describe('update', () => {
    it('should update an employer', async () => {
      const employer : EmployerEntity = {
        id: 1,
        user_id: 1,
        date_of_birth: new Date(),
        updated_at: new Date(),
      };
      const mockEmployer : EmployerDto = {
        user_id: 1,
        date_of_birth: new Date(),
      }

      const employerRepositorySaveSpy = jest
        .spyOn(employerRepository, 'save')
        .mockResolvedValueOnce(employer);

      const result = await service.update(1, mockEmployer);

      expect(employerRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(employer);
    });
  });

  describe('remove', () => {
    it('should delete an employer', async () => {

      const employerRepositoryDeleteSpy = jest
        .spyOn(employerRepository, 'delete')
        .mockResolvedValueOnce(undefined);

      const result = await service.remove(1);

      expect(employerRepositoryDeleteSpy).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });
})