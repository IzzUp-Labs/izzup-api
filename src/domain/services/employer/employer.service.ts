import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EntityCondition } from "../../utils/types/entity-condition.type";
import { EmployerEntity } from "../../../infrastructure/entities/employer.entity";
import { EmployerDto } from "../../../application/employer/dto/employer.dto";
import { UpdateEmployerDto } from "../../../application/employer/dto/update-employer.dto";
import { JobOfferService } from "../job-offer/job-offer.service";
import { JobOfferDto } from "../../../application/job-offer/dto/job-offer.dto";
import { CompanyService } from "../company/company.service";

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(EmployerEntity)
    private employerRepository: Repository<EmployerEntity>,

    private jobOfferService: JobOfferService,
    private readonly companyService: CompanyService
  ) {
  }

  create(employerDto: EmployerDto) {
    return this.employerRepository.save(
      this.employerRepository.create(employerDto)
    );
  }

  findAll() {
    return this.employerRepository.find();
  }

  findOne(fields: EntityCondition<EmployerEntity>) {
    return this.employerRepository.findOne({
      where: fields
    });
  }

  update(id: number, updateEmployerDto: UpdateEmployerDto) {
    return this.employerRepository.save(
      this.employerRepository.create({
        id,
        ...updateEmployerDto
      })
    );
  }

  remove(id: number) {
    return this.employerRepository.delete(id);
  }

  async createJobOffer(employerId: number, jobOfferDto: JobOfferDto) {
    const employer = await this.findOne({ user_id: employerId });
    const company = await this.companyService.findOne({ employer_id: employer.id });
    jobOfferDto.company_id = company.id;
    return this.jobOfferService.create(jobOfferDto);
  }

  async findAllByAuthEmployer(userId: number) {
    const employer = await this.findOne({ user_id: userId });
    const company = await this.companyService.findOne({ employer_id: employer.id });
    return this.jobOfferService.findAllWithRelations(company.id);
  }
}