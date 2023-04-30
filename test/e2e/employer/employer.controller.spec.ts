import { EmployerController } from "../../../src/application/employer/employer.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { EmployerService } from "../../../src/domain/services/employer/employer.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmployerEntity } from "../../../src/infrastructure/entities/employer.entity";

describe('EmployerController', () => {
  let controller: EmployerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployerController],
      providers: [
        EmployerService,
        {
          provide: getRepositoryToken(EmployerEntity),
          useValue: EmployerEntity
        }
      ],
    }).compile();

    controller = module.get<EmployerController>(EmployerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});