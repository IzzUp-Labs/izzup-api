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
        user_id: 1,
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
        user_id: 1,
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
        user_id: 1,
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
        user_id: 1,
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
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date()
      };
      const jobOfferDto: JobOfferDto = {
        company_id: 2,
        job_title: "Test",
        price: 100,
        spots: 1,
        is_available: true
      };

      // Mock service methods
      jest.spyOn(service, 'findOne').mockResolvedValue(employer);
      jest.spyOn(companyService, 'findOne').mockResolvedValue({ id: 2 } as CompanyEntity);
      jest.spyOn(jobOfferService, 'create').mockResolvedValue(jobOfferDto as JobOfferEntity);

      // Execute the method
      const result = await service.createJobOffer(1, jobOfferDto);

      // Assertions
      expect(service.findOne).toHaveBeenCalledWith({ user_id: 1 });
      expect(companyService.findOne).toHaveBeenCalledWith({ employer_id: 1 });
      expect(jobOfferDto.company_id).toBe(2);
      expect(jobOfferService.create).toHaveBeenCalledWith(jobOfferDto);
      expect(result).toBe(jobOfferDto as JobOfferEntity);
    });
  });

  describe('Accepting job request', () => {
    it('should accept extra job request', async () => {
      const userId = 1;
      const jobOfferId = 2;
      const extraId = 3;
      const extraJobRequest: ExtraJobRequestEntity = {
        id: 1,
        extraId: extraId,
        status: JobRequestStatus.PENDING,
      };

      const jobOffer: JobOfferEntity = {
        id: jobOfferId,
        company_id: 1,
        job_title: 'Mock job title',
        price: 100,
        is_available: true,
        requests: [extraJobRequest],
        spots: 1,
      }
      const jobOffers: JobOfferEntity[] = [
        jobOffer
      ];

      jest.spyOn(service, 'findAllByAuthEmployer').mockResolvedValue(jobOffers);
      jest.spyOn(extraJobRequestService, 'update').mockResolvedValue(extraJobRequest);
      jest.spyOn(jobOfferService, 'update').mockResolvedValue(jobOffer);
      jest.spyOn(extraJobRequestService, 'rejectRemainingRequests').mockResolvedValue(null);


      await service.acceptExtraJobRequest(userId, jobOfferId, extraId);

      expect(service.findAllByAuthEmployer).toHaveBeenCalledWith(userId);
      expect(extraJobRequestService.update).toHaveBeenCalledWith(
        extraJobRequest.id,
        expect.objectContaining({ status: JobRequestStatus.ACCEPTED }),
      );
      expect(jobOfferService.update).toHaveBeenCalledWith(
        jobOfferId,
        expect.objectContaining({ is_available: false }),
      );
      expect(extraJobRequestService.rejectRemainingRequests).toHaveBeenCalledWith(
        expect.any(Array),
      );
    });

    it('should throw an exception when no more spots available', async () => {
      const userId = 1;
      const jobOfferId = 2;
      const extraId = 3;
      const extraJobRequest: ExtraJobRequestEntity = {
        id: 1,
        extraId: extraId,
        status: JobRequestStatus.PENDING,
      };
      const acceptedextraJobRequest: ExtraJobRequestEntity = {
        id: 2,
        extraId: 2,
        status: JobRequestStatus.ACCEPTED,
      };

      const jobOffer: JobOfferEntity = {
        id: jobOfferId,
        company_id: 1,
        job_title: 'Mock job title',
        price: 100,
        is_available: true,
        requests: [acceptedextraJobRequest, extraJobRequest],
        spots: 1,
      }
      const jobOffers: JobOfferEntity[] = [
        jobOffer
      ];

      jest.spyOn(service, 'findAllByAuthEmployer').mockResolvedValue(jobOffers);


      // Execute and assert
      await expect(service.acceptExtraJobRequest(userId, jobOfferId, extraId)).rejects.toThrow(
        new HttpException('No more spots available', 400),
      );
    });
  });
})