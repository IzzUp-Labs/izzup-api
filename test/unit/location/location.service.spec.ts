import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../../../src/usecase/location/location.service';
import {JobOfferService} from "../../../src/usecase/job-offer/job-offer.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {LocationEntity} from "../../../src/usecase/location/entities/location.entity";
import {Repository} from "typeorm";
import {JobOfferEntity} from "../../../src/usecase/job-offer/entities/job-offer.entity";

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationService, JobOfferService,
        {
            provide: getRepositoryToken(LocationEntity),
            useValue: Repository
        },
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: Repository
        }],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
