import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../../src/application/auth/auth.controller";
import { AuthService } from "../../../src/domain/services/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { ExtraService } from "../../../src/domain/services/extra/extra.service";
import { UserService } from "../../../src/domain/services/user/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../../src/infrastructure/entities/user.entity";
import { ExtraEntity } from "../../../src/infrastructure/entities/extra.entity";
import { EmployerEntity } from "../../../src/infrastructure/entities/employer.entity";
import { CompanyEntity } from "../../../src/infrastructure/entities/company.entity";
import { CompanyService } from "../../../src/domain/services/company/company.service";
import { EmployerService } from "../../../src/domain/services/employer/employer.service";
import { JobOfferEntity } from "../../../src/infrastructure/entities/job-offer.entity";
import { JobOfferService } from "../../../src/domain/services/job-offer/job-offer.service";
import { ExtraJobRequestService } from "../../../src/domain/services/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/infrastructure/entities/extra-job-request.entity";

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
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
