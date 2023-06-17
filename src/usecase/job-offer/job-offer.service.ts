import { Injectable } from "@nestjs/common";
import { JobOfferEntity } from "./entities/job-offer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { JobOfferDto } from "./dto/job-offer.dto";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(JobOfferEntity)
    private jobOfferRepository: Repository<JobOfferEntity>
  ) {}

  create(jobOfferDto: JobOfferDto) {
    return this.jobOfferRepository.save(
      this.jobOfferRepository.create(jobOfferDto)
    );
  }

  findAll() {
    return this.jobOfferRepository.find();
  }

  findAllAvailable() {
    return this.jobOfferRepository.find({ where: { is_available: true } });
  }

  findOne(fields: EntityCondition<JobOfferEntity>) {
    return this.jobOfferRepository.findOne( { where: fields } );
  }

  findJobOfferWithRequests(fields: EntityCondition<JobOfferEntity>) {
    return this.jobOfferRepository.findOne({
      relations: ['requests', 'company', 'company.employer.user'],
      where: fields
    });
  }

  update(id: number, jobOfferDto: JobOfferDto) {
    return this.jobOfferRepository.save(
      this.jobOfferRepository.create({
        id,
        ...jobOfferDto
      })
    );
  }

  remove(id: number) {
    return this.jobOfferRepository.delete(id);
  }

}