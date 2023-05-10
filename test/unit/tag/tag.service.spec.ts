import { TagEntity } from "../../../src/infrastructure/entities/tag.entity";
import { Repository } from "typeorm";
import { TagService } from "../../../src/domain/services/tag/tag.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('TagService', () => {
  let tagService: TagService;
  let tagRepository: Repository<TagEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(TagEntity),
          useClass: Repository,
        },
      ],
    }).compile();
    tagService = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity)
    );
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const tagDto = { id: 1, name: 'test', color: '#000000' };
      const createdTag = { id: 1, name: 'test', color: '#000000' };
      jest.spyOn(tagRepository, 'create').mockReturnValue(createdTag);
      jest.spyOn(tagRepository, 'save').mockResolvedValue(createdTag);
      const result = await tagService.create(tagDto);
      expect(result).toEqual(createdTag);
    });
  });

  describe('find', () => {
    it('should find a tag by fields', async () => {
      const fields = { id: 1 };
      const foundTag = { id: 1, name: 'test', color: '#000000' };
      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(foundTag);
      const result = await tagService.findOne(fields);
      expect(result).toEqual(foundTag);
    });

    it('should find all tags', async () => {
      const foundTags = [
        { id: 1, name: 'test1', color: '#000000' },
        { id: 2, name: 'test2', color: '#000000' },
      ];
      jest.spyOn(tagRepository, 'find').mockResolvedValue(foundTags);
      const result = await tagService.findAll();
      expect(result).toEqual(foundTags);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const fields = 1;
      const updatedTag = { name: 'newTag'};
      const tag = { id: 1, name: 'test', color: '#000000' };
      jest.spyOn(tagRepository, 'save').mockResolvedValue(tag);
      jest.spyOn(tagRepository, 'create').mockReturnValue(tag);
      const result = await tagService.update(fields, updatedTag as any);
      expect(result).toEqual(tag);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const fields = 1;
      const deletedTag = { id: 1, name: 'test', color: '#000000' };
      jest.spyOn(tagRepository, 'delete').mockResolvedValue(deletedTag as any);
      const result = await tagService.remove(fields);
      expect(result).toEqual(deletedTag);
    });
  });
});