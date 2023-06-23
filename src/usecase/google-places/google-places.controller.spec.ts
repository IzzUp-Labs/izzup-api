import { Test, TestingModule } from '@nestjs/testing';
import { GooglePlacesController } from './google-places.controller';
import { GooglePlacesService } from './google-places.service';

describe('GooglePlacesController', () => {
  let controller: GooglePlacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GooglePlacesController],
      providers: [GooglePlacesService],
    }).compile();

    controller = module.get<GooglePlacesController>(GooglePlacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
