import { EmployerController } from "../../../src/application/employer/employer.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { EmployerService } from "../../../src/domain/services/employer/employer.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmployerEntity } from "../../../src/infrastructure/entities/employer.entity";
import { JobOfferService } from "../../../src/domain/services/job-offer/job-offer.service";
import { CompanyEntity } from "../../../src/infrastructure/entities/company.entity";
import { JobOfferEntity } from "../../../src/infrastructure/entities/job-offer.entity";
import { CompanyService } from "../../../src/domain/services/company/company.service";
import { ParamCheckService } from "../../../src/domain/middleware/param-check/param-check.service";
import { JwtService } from "@nestjs/jwt";
import { ExtraJobRequestEntity } from "../../../src/infrastructure/entities/extra-job-request.entity";
import { ExtraJobRequestService } from "../../../src/domain/services/extra/extra-job-request.service";
import { ExtraService } from "../../../src/domain/services/extra/extra.service";
import { ExtraEntity } from "../../../src/infrastructure/entities/extra.entity";

describe('EmployerController', () => {
  let controller: EmployerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployerController],
      providers: [
        EmployerService,
        JobOfferService,
        CompanyService,
        ParamCheckService,
        JwtService,
        ExtraJobRequestService,
        ExtraService,
        {
          provide: getRepositoryToken(EmployerEntity),
          useValue: EmployerEntity
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

    controller = module.get<EmployerController>(EmployerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});