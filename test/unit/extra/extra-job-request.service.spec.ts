import { ExtraJobRequestService } from "../../../src/domain/services/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/infrastructure/entities/extra-job-request.entity";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JobOfferService } from "../../../src/domain/services/job-offer/job-offer.service";
import { ExtraService } from "../../../src/domain/services/extra/extra.service";
import { ExtraEntity } from "../../../src/infrastructure/entities/extra.entity";
import { JobOfferEntity } from "../../../src/infrastructure/entities/job-offer.entity";
import { JobRequestStatus } from "../../../src/domain/utils/enums/job-request-status";
import { ExtraJobRequestDto } from "../../../src/application/extra/dto/extra-job-request.dto";
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
          extraId: extraId,
          status: JobRequestStatus.PENDING,
        }
        const extra = { id: extraId };
        const jobOffer = { id: jobOfferId, is_available: true, requests: [] };
        const createdRequest = { id: 4 };

        jest.spyOn(extraService, 'findOne').mockResolvedValue(extra as ExtraEntity);
        jest.spyOn(jobOfferService, 'findOne').mockResolvedValue(jobOffer as JobOfferEntity);
        jest.spyOn(repository, 'create').mockReturnValue(extraJobRequestDto as ExtraJobRequestEntity);
        jest.spyOn(repository, 'save').mockResolvedValue(createdRequest as ExtraJobRequestEntity);
        jest.spyOn(jobOfferService, 'update').mockResolvedValue(jobOffer as JobOfferEntity);

        const result = await extraJobRequestService.create(jobOfferId, userId);

        expect(extraService.findOne).toHaveBeenCalledWith({ user_id: userId });
        expect(repository.create).toHaveBeenCalledWith({
          extraId: extra.id,
          status: JobRequestStatus.PENDING,
        });
        expect(jobOfferService.findOne).toHaveBeenCalledWith({ id: jobOfferId });
        expect(repository.save).toHaveBeenCalledWith(extraJobRequestDto);
        expect(jobOfferService.update).toHaveBeenCalledWith(jobOfferId, {
          ...jobOffer,
          requests: [createdRequest],
        });
        expect(result).toBe(jobOffer);
      });

      it('should throw error if job is not available', async () => {
        const extraId = 1;
        const jobOfferId = 2;
        const userId = 3;

        const extraJobRequestDto : ExtraJobRequestDto = {
          extraId: extraId,
          status: JobRequestStatus.PENDING,
        }
        const extra = { id: extraId };
        const jobOffer = { id: jobOfferId, is_available: false, requests: [] };
        const createdRequest = { id: 4 };

        jest.spyOn(extraService, 'findOne').mockResolvedValue(extra as ExtraEntity);
        jest.spyOn(jobOfferService, 'findOne').mockResolvedValue(jobOffer as JobOfferEntity);
        jest.spyOn(repository, 'create').mockReturnValue(extraJobRequestDto as ExtraJobRequestEntity);
        jest.spyOn(repository, 'save').mockResolvedValue(createdRequest as ExtraJobRequestEntity);
        jest.spyOn(jobOfferService, 'update').mockResolvedValue(jobOffer as JobOfferEntity);


        let error;
        try {
          await extraJobRequestService.create(jobOfferId, userId);
        } catch (e) {
          error = e;
        }

        expect(jobOfferService.findOne).toHaveBeenCalledWith({ id: jobOfferId });
        expect(error).toBeInstanceOf(HttpException);
      });
    });
});