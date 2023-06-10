import { ExtraJobRequestController } from "../../../src/application/extra/extra-job-request.controller";
import { ExtraJobRequestService } from "../../../src/domain/services/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/infrastructure/entities/extra-job-request.entity";
import { ExtraService } from "../../../src/domain/services/extra/extra.service";
import { JobOfferService } from "../../../src/domain/services/job-offer/job-offer.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ExtraEntity } from "../../../src/infrastructure/entities/extra.entity";
import { JobOfferEntity } from "../../../src/infrastructure/entities/job-offer.entity";
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