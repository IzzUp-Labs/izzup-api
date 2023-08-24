import { Test, TestingModule } from "@nestjs/testing";
import { LocationController } from "../../../src/usecase/location/location.controller";
import { LocationService } from "../../../src/usecase/location/location.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LocationEntity } from "../../../src/usecase/location/entities/location.entity";
import { JobOfferService } from "../../../src/usecase/job-offer/job-offer.service";
import { Repository } from "typeorm";
import { JobOfferEntity } from "../../../src/usecase/job-offer/entities/job-offer.entity";

describe("LocationController", () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [LocationService, JobOfferService,
        {
          provide: getRepositoryToken(LocationEntity),
          useValue: Repository
        },
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: Repository
        }]
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
