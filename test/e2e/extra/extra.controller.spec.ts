import { Test, TestingModule } from '@nestjs/testing';
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { ExtraController } from "../../../src/usecase/extra/extra.contoller";

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
