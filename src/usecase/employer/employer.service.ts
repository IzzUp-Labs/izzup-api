import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EntityCondition} from "../../domain/utils/types/entity-condition.type";
import {EmployerEntity} from "./entities/employer.entity";
import {EmployerDto} from "./dto/employer.dto";
import {UpdateEmployerDto} from "./dto/update-employer.dto";
import {JobOfferService} from "../job-offer/job-offer.service";
import {JobOfferDto} from "../job-offer/dto/job-offer.dto";
import {CompanyService} from "../company/company.service";
import {ExtraJobRequestService} from "../extra/extra-job-request.service";
import {JobRequestStatus} from "../../domain/utils/enums/job-request-status";

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

  async createJobOffer(userId: number, jobOfferDto: JobOfferDto, company_id: number) {
    const jobOffer = await this.jobOfferService.create(jobOfferDto);
    const myCompanies = await this.getMyCompanies(userId);
    if(!myCompanies || !myCompanies.find(company => company.id === company_id)) {
        throw new HttpException('Company not found', 404);
    }
    return await this.companyService.addJobOffer(company_id, jobOffer.id);
  }

  async getMyCompanies(userId: number) {
    const employerCompanies = await this.employerRepository.findOne({
      relations: ['companies'],
      where: {
        user: {
          id: userId
        }
      }
    })
    return employerCompanies.companies;
  }

  async getMyJobOffers(userId: number) {
    const companies = await this.getMyCompanies(userId);
    return companies.flatMap(company => company.jobOffers);
  }

  async acceptExtraJobRequest(userId: number, request_id: number) {
    const jobOffer = await this.jobOfferService.findJobOfferWithRequests({ requests: { id: request_id } });
    if(jobOffer.company.employer.user.id !== userId) {
      throw new HttpException('You are not the employer of this company', 403);
    }
    if(!jobOffer) {
      throw new HttpException('Job offer not found for this request id', 404);
    }
    let acceptedCount = 0;
    for (const acceptedSpot in jobOffer.requests) {
        if(jobOffer.requests[acceptedSpot].status === JobRequestStatus.ACCEPTED) {
            ++acceptedCount;
        }
        if(acceptedCount === jobOffer.spots) {
            throw new HttpException('No more spots available', 400);
        }
    }

    const request = jobOffer.requests.find(request => request.id === request_id);
    if (!request) {
      throw new HttpException('Request not found', 404);
    }else if(request.status !== JobRequestStatus.PENDING) {
      throw new HttpException('Request is not pending', 400);
    }

    try {
      await this.extraJobRequestService.update(request.id, {
          status: JobRequestStatus.ACCEPTED
      });
    }catch (e) {
      throw new HttpException('Error while accepting request', 500);
    }
    request.status = JobRequestStatus.ACCEPTED;

    acceptedCount++;
    if(acceptedCount === jobOffer.spots) {
      jobOffer.is_available = false;
      await this.jobOfferService.update(jobOffer.id, jobOffer);
      const pendingOffers = jobOffer.requests.map(request => {
        if (request.status === JobRequestStatus.PENDING) {
          return request.id;
        }
      });
      await this.extraJobRequestService.rejectRemainingRequests(pendingOffers);
    }
  }
}