import { Test, TestingModule } from '@nestjs/testing';
import { ExtraService } from "../../../src/domain/services/extra/extra.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ExtraEntity } from "../../../src/infrastructure/entities/extra.entity";
import { ExtraController } from "../../../src/application/extra/extra.contoller";

describe('ExtraController', () => {
  let controller: ExtraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraController],
      providers: [
        ExtraService,
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: ExtraEntity
        }
      ],
    }).compile();

    controller = module.get<ExtraController>(ExtraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
