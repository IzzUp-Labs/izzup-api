import { Test, TestingModule } from '@nestjs/testing';
import {GooglePlacesService} from "../../../src/usecase/google-places/google-places.service";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

describe('GooglePlacesService', () => {
  let service: GooglePlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GooglePlacesService, HttpService, ConfigService,
        {
          provide: "AXIOS_INSTANCE_TOKEN",
          useValue: "AXIOS_INSTANCE_TOKEN"
        }],
    }).compile();

    service = module.get<GooglePlacesService>(GooglePlacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
