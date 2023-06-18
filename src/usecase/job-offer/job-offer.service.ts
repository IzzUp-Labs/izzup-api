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
      this.jobOfferRepository.create({
        ...jobOfferDto,
        acceptedSpots: 0
      })
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
      relations: ['requests', 'company', 'company.employer.user', 'requests.extra'],
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

  updateAvailableSpots(id: number, spots: number) {
    return this.jobOfferRepository.createQueryBuilder()
      .update(JobOfferEntity)
      .set({ acceptedSpots: spots})
      .where("id = :id", { id })
      .execute();
  }

  updateAvailable(id: number, is_available: boolean) {
    return this.jobOfferRepository.createQueryBuilder()
      .update(JobOfferEntity)
      .set({ is_available })
      .where("id = :id", { id })
      .execute();
  }

  remove(id: number) {
    return this.jobOfferRepository.delete(id);
  }

}