import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";
import { ActivitySectorEntity } from "./entities/activity-sector.entity";
import { ActivitySectorDto } from "./dto/activity-sector.dto";
import { UpdateActivitySectorDto } from "./dto/update-activity-sector.dto";

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

  findOne(fields: EntityCondition<ActivitySectorEntity>) {
    return this.activitySectorRepository.findOne({
      where: fields
    });
  }

  update(id: string, updateActivitySectorDto: UpdateActivitySectorDto) {
    return this.activitySectorRepository.save(
      this.activitySectorRepository.create({
        id,
        ...updateActivitySectorDto
      })
    );
  }

  remove(id: string) {
    return this.activitySectorRepository.delete(id);
  }
}
