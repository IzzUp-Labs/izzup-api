import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../../infrastructure/entities/user.entity";
import { Repository } from "typeorm";
import { EntityCondition } from "../../utils/types/entity-condition.type";
import { ExtraEntity } from "../../../infrastructure/entities/extra.entity";
import { UpdateExtraDto } from "../../../application/extra/dto/update-extra.dto";
import { ExtraDto } from "../../../application/extra/dto/extra.dto";

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
    return this.extrasRepository.find();
  }

  findOne(fields: EntityCondition<UserEntity>) {
    return this.extrasRepository.findOne({
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
}