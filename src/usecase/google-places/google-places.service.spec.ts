import { Test, TestingModule } from '@nestjs/testing';
import { GooglePlacesService } from './google-places.service';

describe('GooglePlacesService', () => {
  let service: GooglePlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GooglePlacesService],
    }).compile();

    service = module.get<GooglePlacesService>(GooglePlacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
