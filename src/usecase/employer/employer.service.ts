import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";
import { EmployerEntity } from "./entities/employer.entity";
import { EmployerDto } from "./dto/employer.dto";
import { UpdateEmployerDto } from "./dto/update-employer.dto";
import { JobOfferService } from "../job-offer/job-offer.service";
import { JobOfferDto } from "../job-offer/dto/job-offer.dto";
import { CompanyService } from "../company/company.service";
import { JobRequestStatus } from "../../domain/utils/enums/job-request-status";
import { ExtraJobRequestEntity } from "../extra/entities/extra-job-request.entity";
import { JobOfferEntity } from "../job-offer/entities/job-offer.entity";
import { ExtraJobRequestService } from "../extra/extra-job-request.service";
import { ExtraJobRequestDto } from "../extra/dto/extra-job-request.dto";

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(EmployerEntity)
    private employerRepository: Repository<EmployerEntity>,

    private jobOfferService: JobOfferService,
    private readonly companyService: CompanyService,

    private readonly extraJobRequestService: ExtraJobRequestService
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

  async acceptExtraJobRequest(userId: number, jobOfferId: number, extraId: number) {
    const jobOffers : JobOfferEntity[] = await this.findAllByAuthEmployer(userId);
    const jobOffer = jobOffers.find(jobOffer => jobOffer.id === jobOfferId);
    let acceptedCount = 0;
    for (const accepted in jobOffer.requests) {
      if(jobOffer.requests[accepted].status === JobRequestStatus.ACCEPTED) {
        ++acceptedCount;
      }
      if(acceptedCount === jobOffer.spots) {
        throw new HttpException('No more spots available', 400);
      }
    }
    const extraJobRequest: ExtraJobRequestEntity = jobOffer.requests.find(request => request.extraId === extraId);
    extraJobRequest.status = JobRequestStatus.ACCEPTED;
    const updatedExtraJobRequest: ExtraJobRequestDto = {
      ...extraJobRequest,
      status: JobRequestStatus.ACCEPTED,
    }
    await this.extraJobRequestService.update(extraJobRequest.id, updatedExtraJobRequest);
    if(acceptedCount + 1 === jobOffer.spots) {
      jobOffer.is_available = false;
      await this.jobOfferService.update(jobOffer.id, jobOffer);
      const pendingOffers: number[] = [];
      for (const rejectedRequest of jobOffer.requests) {
        if(rejectedRequest.status === JobRequestStatus.PENDING) {
          pendingOffers.push(rejectedRequest.extraId);
        }
      }
      await this.extraJobRequestService.rejectRemainingRequests(pendingOffers);
    }
  }
}