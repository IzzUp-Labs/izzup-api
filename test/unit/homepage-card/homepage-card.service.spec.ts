import { HomepageCardEntity } from "../../../src/infrastructure/entities/homepage-card.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { HomepageCardService } from "../../../src/domain/services/homepage-card/homepage-card.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HomepageCardDto } from "../../../src/application/homepage-card/dto/homepage-card.dto";
import { HomepageCardTypeEnum } from "../../../src/domain/utils/enums/homepage-card-type.enum";

describe("HomepageCardService", () => {
  let homepageCardService: HomepageCardService;
  let homepageCardRepository: Repository<HomepageCardEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomepageCardService,
        {
          provide: getRepositoryToken(HomepageCardEntity),
          useClass: Repository
        }
      ]
    }).compile();
    homepageCardService = module.get<HomepageCardService>(HomepageCardService);
    homepageCardRepository = module.get<Repository<HomepageCardEntity>>(
      getRepositoryToken(HomepageCardEntity)
    );
  });

  describe("create", () => {
    it("should create a homepageCard", async () => {
      const homepageCardDto : HomepageCardDto = {
        title: "test",
        description: "test",
        photo: "test",
        type: HomepageCardTypeEnum.NEWS,
        link: "test",
        company_id: null
      };
      const createdHomepageCard : HomepageCardEntity = {
        id: 1,
        title: "test",
        description: "test",
        photo: "test",
        type: HomepageCardTypeEnum.NEWS,
        link: "test",
        company_id: null
      };
      jest.spyOn(homepageCardRepository, "create").mockReturnValue(createdHomepageCard);
      jest.spyOn(homepageCardRepository, "save").mockResolvedValue(createdHomepageCard);
      const result = await homepageCardService.create(homepageCardDto);
      expect(result).toEqual(createdHomepageCard);
    });
  });

  describe("find", () => {
    it("should find a homepageCard by fields", async () => {
      const fields = { id: 1 };
      const foundHomepageCard : HomepageCardEntity = {
        id: 1,
        title: "test",
        description: "test",
        photo: "test",
        type: HomepageCardTypeEnum.NEWS,
        link: "test",
        company_id: null
      };
      jest.spyOn(homepageCardRepository, "findOne").mockResolvedValue(foundHomepageCard);
      const result = await homepageCardService.findOne(fields);
      expect(result).toEqual(foundHomepageCard);
    });

    it("should find all homepageCards", async () => {
      const foundHomepageCards : HomepageCardEntity[] = [
        {
          id: 1,title: "test",
          description: "test",
          photo: "test",
          type: HomepageCardTypeEnum.NEWS,
          link: "test",
          company_id: null
        },
        {
          id: 2,title: "test",
          description: "test",
          photo: "test",
          type: HomepageCardTypeEnum.NEWS,
          link: "test",
          company_id: null
        }
      ];
      jest.spyOn(homepageCardRepository, "find").mockResolvedValue(foundHomepageCards);
      const result = await homepageCardService.findAll();
      expect(result).toEqual(foundHomepageCards);
    });
  });

  describe("update", () => {
    it("should update a homepageCard", async () => {
      const homepageCardDto : HomepageCardDto = {
        title: "test",
        description: "test",
        photo: "test",
        type: HomepageCardTypeEnum.NEWS,
        link: "test",
        company_id: null
      };
      const updatedHomepageCard : HomepageCardEntity = {
        id: 1,
        title: "test",
        description: "test",
        photo: "test",
        type: HomepageCardTypeEnum.NEWS,
        link: "test",
        company_id: null
      };
      jest.spyOn(homepageCardRepository, "create").mockReturnValue(updatedHomepageCard);
      jest.spyOn(homepageCardRepository, "save").mockResolvedValue(updatedHomepageCard);
      const result = await homepageCardService.update(1, homepageCardDto);
      expect(result).toEqual(updatedHomepageCard);
    });
  });

  describe("remove", () => {
    it("should remove a homepageCard", async () => {
      jest.spyOn(homepageCardRepository, "delete").mockResolvedValue(undefined);
      const result = await homepageCardService.remove(1);
      expect(result).toBeUndefined();
    });
  });
});