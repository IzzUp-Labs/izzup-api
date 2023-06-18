import { ExtraJobRequestController } from "../../../src/usecase/extra/extra-job-request.controller";
import { ExtraJobRequestService } from "../../../src/usecase/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/usecase/extra/entities/extra-job-request.entity";
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { JobOfferService } from "../../../src/usecase/job-offer/job-offer.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { JobOfferEntity } from "../../../src/usecase/job-offer/entities/job-offer.entity";
import { ParamCheckService } from "../../../src/domain/middleware/param-check/param-check.service";
import { JwtService } from "@nestjs/jwt";

describe("ExtraJobRequestController", () => {
  let controller: ExtraJobRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraJobRequestController],
      providers: [
        ExtraJobRequestService,
        JobOfferService,
        ExtraService,
        ParamCheckService,
        JwtService,
          {
            provide: getRepositoryToken(ExtraJobRequestEntity),
            useValue: ExtraJobRequestEntity
          },
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: JobOfferEntity
        },
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: ExtraEntity
        }
        ],
    }).compile();

    controller = module.get<ExtraJobRequestController>(ExtraJobRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});