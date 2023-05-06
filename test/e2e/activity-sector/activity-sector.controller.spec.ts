import { ActivitySectorController } from "../../../src/application/activity-sector/activity-sector.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { ActivitySectorService } from "../../../src/domain/services/activity-sector/activity-sector.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ActivitySectorEntity } from "../../../src/infrastructure/entities/activity-sector.entity";

describe('ActivitySectorController', () => {
  let controller: ActivitySectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitySectorController],
      providers: [
        ActivitySectorService,
        {
          provide: getRepositoryToken(ActivitySectorEntity),
          useValue: ActivitySectorEntity
        }
      ],
    }).compile();

    controller = module.get<ActivitySectorController>(ActivitySectorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});