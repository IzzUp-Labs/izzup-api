import { CompanyEntity } from "../../../src/usecase/company/entities/company.entity";
import { CompanyDto } from "../../../src/usecase/company/dto/company.dto";
import { CompanyService } from "../../../src/usecase/company/company.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";

describe('CompanyService', () => {
  let companyService: CompanyService;
  let companyRepository: Repository<CompanyEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(CompanyEntity),
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

    companyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<Repository<CompanyEntity>>(
      getRepositoryToken(CompanyEntity)
    );
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const company = new CompanyEntity();
      company.name = 'Test';
      company.address = 'Test';
      company.sectors = [];

      const companyDto = new CompanyDto();
      companyDto.name = 'Test';
      companyDto.address = 'Test';

      jest
        .spyOn(companyRepository, 'create')
        .mockImplementation(() => company);
      jest
        .spyOn(companyRepository, 'save')
        .mockImplementation(() => Promise.resolve(company));

      expect(await companyService.create(companyDto)).toBe(company);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const company = new CompanyEntity();
      company.name = 'Test';
      company.address = 'Test';
      company.sectors = [];

      jest
        .spyOn(companyRepository, 'find')
        .mockImplementation(() => Promise.resolve([company]));

      expect(await companyService.findAll()).toEqual([company]);
    });
  });

  describe('findOne', () => {
    it('should return a company', async () => {
      const company = new CompanyEntity();
      company.name = 'Test';
      company.address = 'Test';
      company.sectors = [];

      jest
        .spyOn(companyRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(company));

      expect(await companyService.findOne({ id: 1 })).toEqual(company);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const company = new CompanyEntity();
      company.name = 'Test';
      company.address = 'Test';
      company.sectors = [];

      const companyDto = new CompanyDto();
      companyDto.name = 'Test';
      companyDto.address = 'Test';

      jest
        .spyOn(companyRepository, 'create')
        .mockImplementation(() => company);
      jest
        .spyOn(companyRepository, 'save')
        .mockImplementation(() => Promise.resolve(company));

      expect(await companyService.update(1, companyDto)).toBe(company);
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const id = 1;
      jest.spyOn(companyRepository, 'delete').mockResolvedValue(undefined);
      const result = await companyService.remove(id);
      expect(result).toBeUndefined();
    });
  });

  describe('addActivitySector', () => {
    it('should add a sector to a company', async () => {
      const companyId = 1;
      const activitySectorId = 1;
      jest.spyOn(companyRepository, 'createQueryBuilder').mockReturnValue({
        relation: jest.fn(() => ({
          of: jest.fn(() => ({
            add: jest.fn(),
          })),
        })),
      } as any);
      const result = await companyService.addActivitySector(
        companyId,
        activitySectorId
      );
      expect(result).toBeUndefined();
    });
  });

  describe('removeActivitySector', () => {
    it('should remove a sector from a company', async () => {
      const companyId = 1;
      const activitySectorId = 1;
      jest.spyOn(companyRepository, 'createQueryBuilder').mockReturnValue({
        relation: jest.fn(() => ({
          of: jest.fn(() => ({
            remove: jest.fn(),
          })),
        })),
      } as any);
      const result = await companyService.removeActivitySector(
        companyId,
        activitySectorId
      );
      expect(result).toBeUndefined();
    });
  });
})