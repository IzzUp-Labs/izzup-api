import { JobOfferEntity } from "../../../src/infrastructure/entities/job-offer.entity";
import { Repository } from "typeorm";
import { JobOfferService } from "../../../src/domain/services/job-offer/job-offer.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EntityCondition } from "../../../src/domain/utils/types/entity-condition.type";

describe("JobOfferService", () => {
  let jobOfferService: JobOfferService;
  let repository: Repository<JobOfferEntity>;

  beforeEach(async () => {
const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferService,
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({
                id: 1,
                company_id: 1,
                job_title: "test",
                price: 100,
                is_available: true,
              }
            ),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    jobOfferService = module.get<JobOfferService>(JobOfferService);
    repository = module.get<Repository<JobOfferEntity>>(
      getRepositoryToken(JobOfferEntity)
    );
  });

  describe("create", () => {
    it("should create a new job offer", async () => {
      const mockJobOffer: JobOfferEntity = {
        id: 1,
        company_id: 1,
        job_title: "test",
        price: 100,
        is_available: true,
        requests: [],
      };

      jest.spyOn(repository, "save").mockResolvedValueOnce(mockJobOffer);

      expect(await jobOfferService.create(mockJobOffer)).toEqual(mockJobOffer);
    });
  });

  describe("findAll", () => {
    it("should return an array of job offers", async () => {
      const mockJobOffer: JobOfferEntity = {
        id: 1,
        company_id: 1,
        job_title: "test",
        price: 100,
        is_available: true,
        requests: [],
      };

      jest.spyOn(repository, "find").mockResolvedValueOnce([mockJobOffer]);

      expect(await jobOfferService.findAll()).toEqual([mockJobOffer]);
    });
  });

  describe("findOne", () => {
    it("should return a job offer", async () => {
      const fields: EntityCondition<JobOfferEntity> = { id: 1 };
      const mockJobOffer: JobOfferEntity = {
        id: 1,
        company_id: 1,
        job_title: "test",
        price: 100,
        is_available: true,
        requests: [],
      };

      jest.spyOn(repository, "findOne").mockResolvedValueOnce(mockJobOffer);

      expect(await jobOfferService.findOne(fields)).toEqual(mockJobOffer);
    });
  });

  describe("update", () => {
    it("should update a job offer", async () => {
      const mockJobOffer: JobOfferEntity = {
        id: 1,
        company_id: 1,
        job_title: "test",
        price: 100,
        is_available: true,
        requests: [],
      };

      jest.spyOn(repository, "findOne").mockResolvedValueOnce(mockJobOffer);
      jest.spyOn(repository, "save").mockResolvedValueOnce(mockJobOffer);

      expect(await jobOfferService.update(1, mockJobOffer)).toEqual(mockJobOffer);
    });
  });

  describe("remove", () => {
    it("should delete a job offer", async () => {
      const mockJobOffer: JobOfferEntity = {
        id: 1,
        company_id: 1,
        job_title: "test",
        price: 100,
        is_available: true,
        requests: [],
      };

      jest.spyOn(repository, "findOne").mockResolvedValueOnce(mockJobOffer);
      jest.spyOn(repository, "delete").mockResolvedValueOnce(undefined as any);

      expect(await jobOfferService.remove(1)).toEqual(undefined as any);
    });
  });
});