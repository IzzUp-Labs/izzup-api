import { EmployerService } from "../../../src/usecase/employer/employer.service";
import { Repository } from "typeorm";
import { EmployerEntity } from "../../../src/usecase/employer/entities/employer.entity";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmployerDto } from "../../../src/usecase/employer/dto/employer.dto";
import { EntityCondition } from "../../../src/domain/utils/types/entity-condition.type";
import { JobOfferService } from "../../../src/usecase/job-offer/job-offer.service";
import { CompanyService } from "../../../src/usecase/company/company.service";
import { CompanyEntity } from "../../../src/usecase/company/entities/company.entity";
import { JobOfferEntity } from "../../../src/usecase/job-offer/entities/job-offer.entity";
import { ExtraJobRequestService } from "../../../src/usecase/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/usecase/extra/entities/extra-job-request.entity";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { JobRequestStatus } from "../../../src/domain/utils/enums/job-request-status";
import { HttpException } from "@nestjs/common";
import { JobOfferDto } from "../../../src/usecase/job-offer/dto/job-offer.dto";

describe('EmployerService', () => {
  let service: EmployerService;
  let employerRepository: Repository<EmployerEntity>;
  let jobOfferService: JobOfferService;
  let extraJobRequestService: ExtraJobRequestService;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmployerService,
        JobOfferService,
        CompanyService,
        ExtraJobRequestService,
        ExtraService,
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
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: CompanyEntity
        },
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: JobOfferEntity
        },
        {
          provide: getRepositoryToken(ExtraJobRequestEntity),
          useValue: ExtraJobRequestEntity
        },
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: ExtraEntity
        }
      ],
    }).compile();

    service = module.get<EmployerService>(EmployerService);
    jobOfferService = module.get<JobOfferService>(JobOfferService);
    extraJobRequestService = module.get<ExtraJobRequestService>(ExtraJobRequestService);
    companyService = module.get<CompanyService>(CompanyService);
    employerRepository = module.get<Repository<EmployerEntity>>(
      getRepositoryToken(EmployerEntity)
    );
  });

  describe('create', () => {
    it('should create an employer', async () => {
      const employer : EmployerEntity = {
        id: 1,
        user: {
          id: 1,
          last_name: 'test',
          first_name: 'test',
          date_of_birth: new Date(),
          extra: null,
          employer: null,
          email: 'test@email.com',
          password: 'test',
          role: 'EMPLOYER',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        },
        companies: [],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date()
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
        user: {
          id: 1,
          last_name: 'test',
          first_name: 'test',
          date_of_birth: new Date(),
          extra: null,
          employer: null,
          email: 'test@email.com',
          password: 'test',
          role: 'EMPLOYER',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        },
        companies: [],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date()
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
        user: {
          id: 1,
          last_name: 'test',
          first_name: 'test',
          date_of_birth: new Date(),
          extra: null,
          employer: null,
          email: 'test@email.com',
          password: 'test',
          role: 'EMPLOYER',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        },
        companies: [],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date()
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
        user: {
          id: 1,
          last_name: 'test',
          first_name: 'test',
          date_of_birth: new Date(),
          extra: null,
          employer: null,
          email: 'test@email.com',
          password: 'test',
          role: 'EMPLOYER',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        },
        companies: [],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date()
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

  describe('createJobOffer', () => {
    it('should create a job offer', async () => {
      // Mock data
      const employer : EmployerEntity = {
        id: 1,
        user: {
          id: 1,
          last_name: 'test',
          first_name: 'test',
          date_of_birth: new Date(),
          extra: null,
          employer: null,
          email: 'test@email.com',
          password: 'test',
          role: 'EMPLOYER',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        },
        companies: [{
          id: 1,
          name: "Test",
          address: "Test",
          sectors: null,
          jobOffers: [],
          employer: null,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        }],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date()
      };
      const jobOfferEntity: JobOfferEntity = {
        id: 1,
        job_title: "Test",
        price: 100,
        spots: 1,
        is_available: true,
        acceptedSpots: 1,
        company: null,
        requests: [],
      };

      // Mock service methods
      jest.spyOn(service, 'getMyCompanies').mockResolvedValue(employer.companies);
      jest.spyOn(jobOfferService, 'create').mockResolvedValue(jobOfferEntity);
      jest.spyOn(companyService, 'addJobOffer').mockResolvedValue(undefined);
      jest.spyOn(jobOfferService, 'updateAvailableSpots').mockResolvedValue(undefined);

      // Execute the method
      const result = await service.createJobOffer(1, jobOfferEntity as JobOfferDto, 1);

      // Assertions
      expect(jobOfferService.create).toHaveBeenCalledWith(jobOfferEntity);
      expect(companyService.addJobOffer).toHaveBeenCalledWith(1,1);
      expect(result).toBe(undefined);
    });
  });

  describe('Accepting job request', () => {
    it('should return not found', async () => {
      const userId = 1;
      const jobOfferId = 2;
      const extraJobRequest: ExtraJobRequestEntity = {
        id: 1,
        status: JobRequestStatus.PENDING,
        extra: null,
        jobOffer: null,
      };

      const jobOffer: JobOfferEntity = {
        id: jobOfferId,
        job_title: 'Mock job title',
        price: 100,
        is_available: true,
        requests: [],
        spots: 1,
        acceptedSpots: 0,
        company: {
          id: 1,
          name: "Test",
          address: "Test",
          sectors: null,
          jobOffers: [],
          employer: {
            id: 1,
            user: {
              id: 1,
              last_name: 'test',
              first_name: 'test',
              date_of_birth: new Date(),
              extra: null,
              employer: null,
              email: 'test',
              password: 'test',
              role: 'EMPLOYER',
              created_at: new Date(),
              updated_at: new Date(),
              deleted_at: new Date()
            },
            companies: null,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: new Date()
          },
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        },

      }
      const jobOffers: JobOfferEntity[] = [
        jobOffer
      ];

      const createQueryBuilder: any = {
        update: () => createQueryBuilder,
        set: () => createQueryBuilder,
        where: () => createQueryBuilder,
        execute: () => Promise.resolve(),
      }

      jest.spyOn(jobOfferService, 'findJobOfferWithRequests').mockResolvedValue(jobOffer);
      jest.spyOn(service, 'getMyJobOffers').mockResolvedValue(jobOffers);
      jest.spyOn(extraJobRequestService, 'update').mockResolvedValue(extraJobRequest);
      jest.spyOn(jobOfferService, 'update').mockResolvedValue(jobOffer);
      jest.spyOn(extraJobRequestService, 'rejectRemainingRequests').mockResolvedValue(null);
      jest.spyOn(jobOfferService, 'updateAvailableSpots')

      await expect(service.acceptExtraJobRequest(userId, extraJobRequest.id)).rejects.toThrow(
        new HttpException('Request not found', 404),
      );

    });

    it('should throw an exception when no more spots available', async () => {
      const userId = 1;
      const jobOfferId = 2;
      const extraJobRequest: ExtraJobRequestEntity = {
        id: 1,
        status: JobRequestStatus.PENDING,
        extra: null,
        jobOffer: null,
      };
      const acceptedextraJobRequest: ExtraJobRequestEntity = {
        id: 2,
        status: JobRequestStatus.PENDING,
        extra: null,
        jobOffer: null,
      };

      const jobOffer: JobOfferEntity = {
        id: jobOfferId,
        job_title: 'Mock job title',
        price: 100,
        is_available: true,
        requests: [acceptedextraJobRequest],
        spots: 1,
        acceptedSpots: 1,
        company: {
          id: 1,
          name: "Test",
          address: "Test",
          sectors: null,
          jobOffers: [],
          employer: {
            id: 1,
            user: {
              id: 1,
              last_name: 'test',
              first_name: 'test',
              date_of_birth: new Date(),
              extra: null,
              employer: null,
              email: 'test',
              password: 'test',
              role: 'EMPLOYER',
              created_at: new Date(),
              updated_at: new Date(),
              deleted_at: new Date()
            },
            companies: null,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: new Date()
          },
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        },
      }
      const jobOffers: JobOfferEntity[] = [
        jobOffer
      ];

      jest.spyOn(service, 'getMyJobOffers').mockResolvedValue(jobOffers);
      jest.spyOn(extraJobRequestService, 'update').mockResolvedValue(extraJobRequest);
      jest.spyOn(jobOfferService, 'update').mockResolvedValue(jobOffer);
      jest.spyOn(extraJobRequestService, 'rejectRemainingRequests').mockResolvedValue(null);
      jest.spyOn(jobOfferService, 'findJobOfferWithRequests').mockResolvedValue(jobOffer);



      // Execute and assert
      await expect(service.acceptExtraJobRequest(userId, extraJobRequest.id)).rejects.toThrow(
        new HttpException('No more spots available', 400),
      );
    });
  });
})