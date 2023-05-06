import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EntityCondition } from "../../utils/types/entity-condition.type";
import { UserEntity } from "../../../infrastructure/entities/user.entity";
import { ActivitySectorEntity } from "../../../infrastructure/entities/activity-sector.entity";
import { ActivitySectorDto } from "../../../application/activity-sector/dto/activity-sector.dto";
import { UpdateActivitySectorDto } from "../../../application/activity-sector/dto/update-activity-sector.dto";

@Injectable()
export class ActivitySectorService {
  constructor(
    @InjectRepository(ActivitySectorEntity)
    private activitySectorRepository: Repository<ActivitySectorEntity>
  ) {
  }

  create(activitySectorDto: ActivitySectorDto) {
    return this.activitySectorRepository.save(
      this.activitySectorRepository.create(activitySectorDto)
    );
  }

  findAll() {
    return this.activitySectorRepository.find();
  }

  findOne(fields: EntityCondition<UserEntity>) {
    return this.activitySectorRepository.findOne({
      where: fields
    });
  }

  update(id: number, updateActivitySectorDto: UpdateActivitySectorDto) {
    return this.activitySectorRepository.save(
      this.activitySectorRepository.create({
        id,
        ...updateActivitySectorDto
      })
    );
  }

  remove(id: number) {
    return this.activitySectorRepository.delete(id);
  }
}