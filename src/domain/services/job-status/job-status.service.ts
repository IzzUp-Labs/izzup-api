import { JobStatusEntity } from "../../../infrastructure/entities/job-status.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { JobStatusDto } from "../../../application/job-status/dto/job-status.dto";
import { EntityCondition } from "../../utils/types/entity-condition.type";
import { UpdateJobStatusDto } from "../../../application/job-status/dto/update-job-status.dto";

@Injectable()
export class JobStatusService {
  constructor(
    @InjectRepository(JobStatusEntity)
    private readonly jobStatusRepository: Repository<JobStatusEntity>
  ) {}

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

  update(id: number, updatedJobStatus: UpdateJobStatusDto) {
    return this.jobStatusRepository.save(
      this.jobStatusRepository.create({
        id,
        ...updatedJobStatus
      })
    );
  }

  remove(id: number) {
    return this.jobStatusRepository.delete(id);
  }
}