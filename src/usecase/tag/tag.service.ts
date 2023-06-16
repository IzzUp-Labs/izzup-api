import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TagEntity } from "./entities/tag.entity";
import { Repository } from "typeorm";
import { TagDto } from "./dto/tag.dto";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  create(tagDto: TagDto) {
    return this.tagRepository.save(
      this.tagRepository.create(tagDto),
    );
  }

  findAll() {
    return this.tagRepository.find();
  }

  findOne(fields: EntityCondition<TagEntity>) {
    return this.tagRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagRepository.save(
      this.tagRepository.create({
        id,
        ...updateTagDto,
      }),
    );
  }

  remove(id: number) {
    return this.tagRepository.delete(id);
  }
}