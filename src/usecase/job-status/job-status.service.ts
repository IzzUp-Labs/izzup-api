import { JobStatusEntity } from "./entities/job-status.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { JobStatusDto } from "./dto/job-status.dto";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";
import { UpdateJobStatusDto } from "./dto/update-job-status.dto";

@Injectable()
export class JobStatusService {
  constructor(
    @InjectRepository(JobStatusEntity)
    private readonly jobStatusRepository: Repository<JobStatusEntity>
  ) {
  }

  create(JobStatusDto: JobStatusDto) {
    return this.jobStatusRepository.save(
      this.jobStatusRepository.create(JobStatusDto)
    );
  }

  findAll() {
    return this.jobStatusRepository.find();
  }

  findOne(fields: EntityCondition<JobStatusEntity>) {
    return this.jobStatusRepository.findOne({ where: fields });
  }

  update(id: string, updatedJobStatus: UpdateJobStatusDto) {
    return this.jobStatusRepository.save(
      this.jobStatusRepository.create({
        id,
        ...updatedJobStatus
      })
    );
  }

  remove(id: string) {
    return this.jobStatusRepository.delete(id);
  }
}
