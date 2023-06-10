import { Injectable } from "@nestjs/common";
import { JobOfferEntity } from "../../../infrastructure/entities/job-offer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { JobOfferDto } from "../../../application/job-offer/dto/job-offer.dto";
import { EntityCondition } from "../../utils/types/entity-condition.type";

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

  findAllWithRelations(id: number) {
    return this.jobOfferRepository.find(
      {
        where: {
          company_id: id
        },
        relations: {
          requests: true,
        }
      }
    )
  }

  findOne(fields: EntityCondition<JobOfferEntity>) {
    return this.jobOfferRepository.findOne( { where: fields } );
  }

  findOneWithRelations(fields: EntityCondition<JobOfferEntity>) {
    return this.jobOfferRepository.findOne( { where: fields, relations: { requests: true } } );
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