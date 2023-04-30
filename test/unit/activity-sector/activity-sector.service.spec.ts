import { ActivitySectorDto } from "../../../src/application/activity-sector/dto/activity-sector.dto";
import { ActivitySectorEntity } from "../../../src/infrastructure/entities/activity-sector.entity";
import { ActivitySectorService } from "../../../src/domain/services/activity-sector/activity-sector.service";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('ActivitySectorService', () => {
  let service: ActivitySectorService;
  let repository: Repository<ActivitySectorEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitySectorService,
        {
          provide: getRepositoryToken(ActivitySectorEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ActivitySectorService>(ActivitySectorService);
    repository = module.get<Repository<ActivitySectorEntity>>(
      getRepositoryToken(ActivitySectorEntity),
    );
  });

  describe('create', () => {
    it('should create an activity sector', async () => {
      const activitySectorDto: ActivitySectorDto = { name: 'test' };
      const createdActivitySector: ActivitySectorEntity = {
        id: 1,
        name: 'test',
      };

      jest
        .spyOn(repository, 'create')
        .mockReturnValue(createdActivitySector);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createdActivitySector);

      const result = await service.create(activitySectorDto);

      expect(result).toEqual(createdActivitySector);
    });
  });

  describe('findOne', () => {
    it('should find an activity sector by fields', async () => {
      const fields: { id: number } = { id: 1 };
      const foundActivitySector: ActivitySectorEntity = {
        id: 1,
        name: 'test',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(foundActivitySector);

      const result = await service.findOne(fields);

      expect(result).toEqual(foundActivitySector);
    });
  });

  describe('findAll', () => {
    it('should find all activity sectors', async () => {
      const foundActivitySectors: ActivitySectorEntity[] = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(foundActivitySectors);

      const result = await service.findAll();

      expect(result).toEqual(foundActivitySectors);
    });
  });

  describe('delete', () => {
    it('should delete an activity sector by id', async () => {
      const id = 1;

      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      const result = await service.remove(id);

      expect(result).toEqual(undefined);
    });
  });

  describe('update', () => {
    it('should update an activity sector by id', async () => {
      const id = 1;
      const activitySectorDto: ActivitySectorDto = { id: 1, name: 'test' };
      const updatedActivitySector: ActivitySectorEntity = {
        id: 1,
        name: 'test',
      };

      jest
        .spyOn(repository, 'create')
        .mockImplementation(() => updatedActivitySector);
      jest
        .spyOn(repository, 'save')
        .mockImplementation(() => Promise.resolve(updatedActivitySector));

      const result = await service.update(id, activitySectorDto);

      expect(result).toEqual(activitySectorDto);
    });
  });
})