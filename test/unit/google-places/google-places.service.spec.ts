import { Test, TestingModule } from "@nestjs/testing";
import { GooglePlacesService } from "../../../src/usecase/google-places/google-places.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import {CompanyService} from "../../../src/usecase/company/company.service";
import {CompanyEntity} from "../../../src/usecase/company/entities/company.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

describe("GooglePlacesService", () => {
  let service: GooglePlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GooglePlacesService, HttpService, ConfigService,CompanyService,
        {
          provide: "AXIOS_INSTANCE_TOKEN",
          useValue: "AXIOS_INSTANCE_TOKEN"
        },
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: CompanyEntity
        }]
    }).compile();

    service = module.get<GooglePlacesService>(GooglePlacesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
