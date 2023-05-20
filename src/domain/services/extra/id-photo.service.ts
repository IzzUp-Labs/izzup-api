import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { IdPhotoEntity } from "../../../infrastructure/entities/id-photo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IdPhotoDto } from "../../../application/extra/dto/id-photo.dto";
import { EntityCondition } from "../../utils/types/entity-condition.type";

@Injectable()
export class IdPhotoService {
  constructor(
    @InjectRepository(IdPhotoEntity)
    private idPhotosRepository: Repository<IdPhotoEntity>
  ) {
  }

  create(idPhotoDto: IdPhotoDto) {
    return this.idPhotosRepository.save(
      this.idPhotosRepository.create(idPhotoDto)
    );
  }

  findAll() {
    return this.idPhotosRepository.find();
  }

  findOne(fields: EntityCondition<IdPhotoEntity>) {
    return this.idPhotosRepository.findOne({
      where: fields
    });
  }

  remove(id: number) {
    return this.idPhotosRepository.delete(id);
  }
}