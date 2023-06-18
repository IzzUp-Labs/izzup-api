import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";
import { ExtraEntity } from "./entities/extra.entity";
import { UpdateExtraDto } from "./dto/update-extra.dto";
import { ExtraDto } from "./dto/extra.dto";
import { TagDto } from "../tag/dto/tag.dto";

@Injectable()
export class ExtraService {
  constructor(
    @InjectRepository(ExtraEntity)
    private extrasRepository: Repository<ExtraEntity>
  ) {
  }

  create(extraDto: ExtraDto) {
    return this.extrasRepository.save(
      this.extrasRepository.create(extraDto)
    );
  }

  findAll() {
    return this.extrasRepository.find({
      relations: {
        tags: true
      }
    });
  }

  findOne(fields: EntityCondition<ExtraEntity>) {
    return this.extrasRepository.findOne({
      relations: {
        tags: true
      },
      where: fields
    });
  }

  update(id: number, updateExtraDto: UpdateExtraDto) {
    return this.extrasRepository.save(
      this.extrasRepository.create({
        id,
        ...updateExtraDto
      })
    );
  }

  remove(id: number) {
    return this.extrasRepository.delete(id);
  }

  addTag(extraId: number, tagId: number) {
    try {
      return this.extrasRepository
        .createQueryBuilder()
        .relation(ExtraEntity, "tags")
        .of(extraId)
        .add(tagId)
    }
    catch (error) {
      throw new Error("Tag not found");
    }
  }

  async addTags(extraId: EntityCondition<UserEntity>, tagIds: TagDto[]) {
    try {
      const user = await this.extrasRepository.findOne( {where: extraId});
      user.tags = tagIds;
      return this.extrasRepository.save(user);
    }
    catch (error) {
      throw new Error("Tag not found");
    }
  }

  removeTag(extraId: number, tagId: number) {
    try {
      return this.extrasRepository
        .createQueryBuilder()
        .relation(ExtraEntity, "tags")
        .of(extraId)
        .remove(tagId);
    }
    catch (error) {
      throw new Error("Tag not found");
    }
  }
}