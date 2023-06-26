import { Test, TestingModule } from '@nestjs/testing';
import { GooglePlacesController } from '../../../src/usecase/google-places/google-places.controller';
import { GooglePlacesService } from '../../../src/usecase/google-places/google-places.service';
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";

describe('GooglePlacesController', () => {
  let controller: GooglePlacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GooglePlacesController],
      providers: [GooglePlacesService, HttpService, ConfigService,
        {
          provide: "AXIOS_INSTANCE_TOKEN",
          useValue: "AXIOS_INSTANCE_TOKEN"
        }],
    }).compile();

    controller = module.get<GooglePlacesController>(GooglePlacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
