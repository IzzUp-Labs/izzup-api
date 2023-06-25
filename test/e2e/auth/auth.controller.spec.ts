import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../../src/usecase/auth/auth.controller";
import { AuthService } from "../../../src/usecase/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { UserService } from "../../../src/usecase/user/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../../src/usecase/user/entities/user.entity";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { EmployerEntity } from "../../../src/usecase/employer/entities/employer.entity";
import { CompanyEntity } from "../../../src/usecase/company/entities/company.entity";
import { CompanyService } from "../../../src/usecase/company/company.service";
import { EmployerService } from "../../../src/usecase/employer/employer.service";
import { JobOfferEntity } from "../../../src/usecase/job-offer/entities/job-offer.entity";
import { JobOfferService } from "../../../src/usecase/job-offer/job-offer.service";
import { ExtraJobRequestService } from "../../../src/usecase/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/usecase/extra/entities/extra-job-request.entity";
import { UserStatusService } from "../../../src/usecase/user-status/user-status.service";
import { UserStatusEntity } from "../../../src/usecase/user-status/entities/user-status.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { FileExtensionChecker } from "../../../src/domain/utils/file-extension-checker/file-extension-checker";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        ExtraService,
        UserService,
        EmployerService,
        CompanyService,
        JobOfferService,
        ExtraJobRequestService,
        UserStatusService,
        ConfigService,
        FileExtensionChecker,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: UserEntity
        },
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: ExtraEntity
        },
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
          provide: getRepositoryToken(UserStatusEntity),
          useValue: Repository
        },
        {
          provide: 'FIREBASE_TOKEN',
          useValue: 'FIREBASE_TOKEN',
        },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
