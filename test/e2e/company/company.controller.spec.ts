import { CompanyController } from "../../../src/usecase/company/company.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CompanyService } from "../../../src/usecase/company/company.service";
import { CompanyEntity } from "../../../src/usecase/company/entities/company.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: CompanyEntity
        }
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});