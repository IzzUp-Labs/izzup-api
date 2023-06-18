import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TagController } from "../../../src/usecase/tag/tag.controller";
import { TagEntity } from "../../../src/usecase/tag/entities/tag.entity";
import { TagService } from "../../../src/usecase/tag/tag.service";

describe('TagController', () => {
  let controller: TagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        TagService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: TagEntity
        }
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
