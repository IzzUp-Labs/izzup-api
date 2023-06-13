import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HomepageCardEntity } from "../../../infrastructure/entities/homepage-card.entity";
import { Repository } from "typeorm";
import { EntityCondition } from "../../utils/types/entity-condition.type";

@Injectable()
export class HomepageCardService{
  constructor(
    @InjectRepository(HomepageCardEntity)
    private readonly homepageCardRepository: Repository<HomepageCardEntity>
  ) {
  }

  create(homepageCardDto) {
    return this.homepageCardRepository.save(
      this.homepageCardRepository.create(homepageCardDto)
    );
  }

  findAll() {
    return this.homepageCardRepository.find();
  }

  findOne(fields: EntityCondition<HomepageCardEntity>) {
    return this.homepageCardRepository.findOne({ where: fields });
  }

  update(id: number, homepageCardDto) {
    return this.homepageCardRepository.save(
      this.homepageCardRepository.create({
        id,
        ...homepageCardDto
      })
    );
  }

  remove(id: number) {
    return this.homepageCardRepository.delete(id);
  }
}