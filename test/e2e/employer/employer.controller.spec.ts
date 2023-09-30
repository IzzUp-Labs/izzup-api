import { EmployerController } from "../../../src/usecase/employer/employer.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { EmployerService } from "../../../src/usecase/employer/employer.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmployerEntity } from "../../../src/usecase/employer/entities/employer.entity";
import { JobOfferService } from "../../../src/usecase/job-offer/job-offer.service";
import { CompanyEntity } from "../../../src/usecase/company/entities/company.entity";
import { JobOfferEntity } from "../../../src/usecase/job-offer/entities/job-offer.entity";
import { CompanyService } from "../../../src/usecase/company/company.service";
import { ParamCheckService } from "../../../src/domain/middleware/param-check/param-check.service";
import { JwtService } from "@nestjs/jwt";
import { ExtraJobRequestEntity } from "../../../src/usecase/extra/entities/extra-job-request.entity";
import { ExtraJobRequestService } from "../../../src/usecase/extra/extra-job-request.service";
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { NotificationService } from "../../../src/usecase/notification/notification.service";
import {DeviceService} from "../../../src/usecase/device/device.service";
import {DeviceEntity} from "../../../src/usecase/device/entities/device.entity";
import {I18nService} from "nestjs-i18n";

describe("EmployerController", () => {
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
        DeviceService,
        NotificationService,
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
        },
        {
          provide: getRepositoryToken(DeviceEntity),
          useValue: DeviceEntity
        },
        {
          provide: "FIREBASE_TOKEN",
          useValue: "FIREBASE_TOKEN"
        },
        {
          provide: I18nService,
          useValue: I18nService
        }
      ]
    }).compile();

    controller = module.get<EmployerController>(EmployerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
