import { Test, TestingModule } from '@nestjs/testing';
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { ExtraController } from "../../../src/usecase/extra/extra.contoller";
import {ParamCheckService} from "../../../src/domain/middleware/param-check/param-check.service";
import {JwtService} from "@nestjs/jwt";

describe('ExtraController', () => {
  let controller: ExtraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraController],
      providers: [
        JwtService,
        ParamCheckService,
        ExtraService,
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: ExtraEntity
        },

      ],
    }).compile();

    controller = module.get<ExtraController>(ExtraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
