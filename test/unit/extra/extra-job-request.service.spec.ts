import { ExtraJobRequestService } from "../../../src/usecase/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/usecase/extra/entities/extra-job-request.entity";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JobOfferService } from "../../../src/usecase/job-offer/job-offer.service";
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { JobOfferEntity } from "../../../src/usecase/job-offer/entities/job-offer.entity";
import { JobRequestStatus } from "../../../src/domain/utils/enums/job-request-status";
import { ExtraJobRequestDto } from "../../../src/usecase/extra/dto/extra-job-request.dto";
import { HttpException } from "@nestjs/common";

describe('ExtraJobRequestService', () => {
  let extraJobRequestService: ExtraJobRequestService;
  let repository: Repository<ExtraJobRequestEntity>;
  let extraService: ExtraService;
  let jobOfferService: JobOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExtraJobRequestService,
        JobOfferService,
        ExtraService,
        {
          provide: getRepositoryToken(ExtraJobRequestEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({
              id: 1,
              extra_id: 1,
              status: "PENDING",
            }),
            delete: jest.fn()
            },
          },
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: {
            findOne: jest.fn()
          },
        },
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: {
            findOne: jest.fn(),
            findOneWithRelations: jest.fn(),
            update: jest.fn(),
          },
        }
      ],
    }).compile();

    extraJobRequestService = module.get<ExtraJobRequestService>(ExtraJobRequestService);
    extraService = module.get(ExtraService);
    jobOfferService = module.get(JobOfferService);
    repository = module.get<Repository<ExtraJobRequestEntity>>(
      getRepositoryToken(ExtraJobRequestEntity)
    );
  });

    describe('create', () => {
      it('should create a new extra job request if job is available', async () => {
        const extraId = 1;
        const jobOfferId = 2;
        const userId = 3;

        const extraJobRequestDto : ExtraJobRequestDto = {
          status: JobRequestStatus.PENDING,
        }
        const extra: ExtraEntity = {
            id: extraId,
            user: null,
            requests: [],
            address: null,
            tags: [],
            created_at: null,
            deleted_at: null,
            updated_at: null,
        };
        const jobOffer = { id: jobOfferId, is_available: true, requests: [], spots: 1 };
        const createdRequest = { id: 4 };

        jest.spyOn(extraService, 'findOne').mockResolvedValue(extra as ExtraEntity);
        jest.spyOn(jobOfferService, 'findOne').mockResolvedValue(jobOffer as JobOfferEntity);
        jest.spyOn(jobOfferService, 'findJobOfferWithRequests').mockResolvedValue(jobOffer as JobOfferEntity);
        jest.spyOn(repository, 'create').mockReturnValue(extraJobRequestDto as ExtraJobRequestEntity);
        jest.spyOn(repository, 'save').mockResolvedValue(createdRequest as ExtraJobRequestEntity);
        jest.spyOn(jobOfferService, 'update').mockResolvedValue(jobOffer as JobOfferEntity);

        const result = await extraJobRequestService.create(jobOfferId, userId);

        expect(extraService.findOne).toHaveBeenCalledWith({ user: { id: userId } });
        expect(jobOfferService.findJobOfferWithRequests).toHaveBeenCalledWith({ id: jobOfferId });
        expect(result).toBe(undefined);
      });

      it('should throw error if job is not available', async () => {
        const extraId = 1;
        const jobOfferId = 2;
        const userId = 3;

        const extraJobRequestDto : ExtraJobRequestDto = {
          status: JobRequestStatus.PENDING,
        }
        const extra = { id: extraId };
        const jobOffer = { id: jobOfferId, is_available: false, requests: [] };
        const createdRequest = { id: 4 };

        jest.spyOn(extraService, 'findOne').mockResolvedValue(extra as ExtraEntity);
        jest.spyOn(jobOfferService, 'findOne').mockResolvedValue(jobOffer as JobOfferEntity);
        jest.spyOn(jobOfferService, 'findJobOfferWithRequests').mockResolvedValue(jobOffer as JobOfferEntity);
        jest.spyOn(repository, 'create').mockReturnValue(extraJobRequestDto as ExtraJobRequestEntity);
        jest.spyOn(repository, 'save').mockResolvedValue(createdRequest as ExtraJobRequestEntity);
        jest.spyOn(jobOfferService, 'update').mockResolvedValue(jobOffer as JobOfferEntity);


        let error;
        try {
          await extraJobRequestService.create(jobOfferId, userId);
        } catch (e) {
          error = e;
        }

        expect(jobOfferService.findJobOfferWithRequests).toHaveBeenCalledWith({ id: jobOfferId });
        expect(error).toBeInstanceOf(HttpException);
      });
    });
});