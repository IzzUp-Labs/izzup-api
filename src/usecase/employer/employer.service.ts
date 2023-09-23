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
import { ExtraJobRequestService } from "../extra/extra-job-request.service";
import { JobRequestStatus } from "../../domain/utils/enums/job-request-status";
import { JobOfferEntity } from "../job-offer/entities/job-offer.entity";
import * as moment from "moment";
import { ExtraJobRequestEntity } from "../extra/entities/extra-job-request.entity";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(EmployerEntity)
    private employerRepository: Repository<EmployerEntity>,
    private jobOfferService: JobOfferService,
    private readonly companyService: CompanyService,
    private readonly extraJobRequestService: ExtraJobRequestService,
    private readonly notificationService: NotificationService
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

  update(id: string, updateEmployerDto: UpdateEmployerDto) {
    return this.employerRepository.save(
      this.employerRepository.create({
        id,
        ...updateEmployerDto
      })
    );
  }

  remove(id: string) {
    return this.employerRepository.delete(id);
  }

  async createJobOffer(userId: string, jobOfferDto: JobOfferDto, company_id: string) {
    const currentStartingDate = moment(jobOfferDto.starting_date);
    if (currentStartingDate.isBefore(moment())) {
      throw new HttpException("Starting date must be in the future", 400);
    }
    const jobOffer = await this.jobOfferService.create(jobOfferDto);
    const myCompanies = await this.getMyCompanies(userId);
    if (!myCompanies || !myCompanies.find(company => company.id === company_id)) {
      throw new HttpException("Company not found", 404);
    }
    return await this.companyService.addJobOffer(company_id, jobOffer.id);
  }

  async getMyCompanies(userId: string) {
    const employerCompanies = await this.employerRepository.findOne({
      relations: ["companies"],
      where: {
        user: {
          id: userId
        }
      }
    });
    return employerCompanies.companies;
  }

  async getMyJobOffersWithExtraUsers(userId: string) {
    const employer = await this.getEmployerWithCompanies(userId);
    return await this.jobOfferService.findJobOffersWithRequestsAndExtraUsers(employer.companies[0].id);
  }

  async getEmployerWithCompanies(userId: string) {
    return await this.employerRepository.findOne({
      relations: ["companies", "companies.jobOffers.requests", "user"],
      where: {
        user: {
          id: userId
        }
      }
    });
  }

  async getMyJobOffers(userId: string) {
    const companies = await this.getMyCompanies(userId);
    return companies.flatMap(company => company.jobOffers);
  }

  async acceptExtraJobRequest(userId: string, request_id: string) {
    const jobOffer = await this.jobOfferService.findJobOfferWithRequests({ requests: { id: request_id } });

    if (jobOffer.company.employer.user.id !== userId) {
      throw new HttpException("You are not the employer of this company", 403);
    }
    if (!jobOffer) {
      throw new HttpException("Job offer not found for this request id", 404);
    }

    if (jobOffer.acceptedSpots === jobOffer.spots) {
      throw new HttpException("No more spots available", 400);
    }

    const request = jobOffer.requests.find(request => request.id === request_id);
    if (!request) {
      throw new HttpException("Request not found", 404);
    } else if (request.status !== JobRequestStatus.PENDING) {
      throw new HttpException("Request is not pending", 400);
    }

    try {
      await this.extraJobRequestService.update(request.id, {
        status: JobRequestStatus.ACCEPTED
      });
    } catch (e) {
      throw new HttpException("Error while accepting request", 500);
    } finally {
      // If the request is accepted, we update the number of accepted spots and all other requests are rejected for the extra at the same time
      await this.extraJobRequestService.rejectExtraRequestWhenAccepted(request.extra.id, jobOffer);
      await this.jobOfferService.updateAvailableSpots(jobOffer.id, jobOffer.acceptedSpots + 1);
    }
    request.status = JobRequestStatus.ACCEPTED;

    // NOTIFICATION : SEND NOTIFICATION TO EXTRA (JOB-REQUEST-ACCEPTED)
    await this.notificationService.sendJobNotificationToUser(userId, "job-request-accepted-body", {
      type: "job-request-accepted",
      job_offer: jobOffer,
      job_request: request
    });

    if (jobOffer.acceptedSpots + 1 === jobOffer.spots) {
      return await this.setJobOfferExpired(jobOffer);
    }
  }

  async rejectExtraJobRequest(userId: string, request_id: string) {
    const jobOffer = await this.jobOfferService.findJobOfferWithRequests({ requests: { id: request_id } });
    if (jobOffer.company.employer.user.id !== userId) {
      throw new HttpException("You are not the employer of this company", 403);
    }
    if (!jobOffer) {
      throw new HttpException("Job offer not found for this request id", 404);
    }

    const request = jobOffer.requests.find(request => request.id === request_id);
    if (!request) {
      throw new HttpException("Request not found", 404);
    } else if (request.status !== JobRequestStatus.PENDING) {
      throw new HttpException("Request is not pending", 400);
    }

    try {
      await this.extraJobRequestService.update(request.id, {
        status: JobRequestStatus.REJECTED
      });
    } catch (e) {
      throw new HttpException("Error while rejecting request", 500);
    }
    request.status = JobRequestStatus.REJECTED;
  }

  async confirmWork(userId: string, request_id: string) {
    const jobOffer = await this.jobOfferService.findJobOfferWithRequests({ requests: { id: request_id } });
    if (jobOffer.company.employer.user.id !== userId) {
      throw new HttpException("You are not the employer of this company", 403);
    }
    if (!jobOffer) {
      throw new HttpException("Job offer not found for this request id", 404);
    }

    const request = jobOffer.requests.find(request => request.id === request_id);
    if (!request) {
      throw new HttpException("Request not found", 404);
    } else if (request.status !== JobRequestStatus.ACCEPTED) {
      throw new HttpException("Request is not accepted", 400);
    }

    const currentStartingDate = moment(jobOffer.starting_date);
    if (currentStartingDate.isAfter(moment())) {
      throw new HttpException("Starting date is not passed yet", 400);
    }
    const newRequest: ExtraJobRequestEntity = request;
    const verification_code = Math.floor(1000 + Math.random() * 9000);
    try {
      await this.extraJobRequestService.update(request.id, {
        status: JobRequestStatus.WAITING_FOR_VERIFICATION,
        verification_code: verification_code
      });
    } catch (e) {
      throw new HttpException("Error while confirming request", 500);
    }
    newRequest.status = JobRequestStatus.WAITING_FOR_VERIFICATION;
    newRequest.verification_code = verification_code;

    // NOTIFICATION : SEND NOTIFICATION TO EXTRA (JOB-REQUEST-CONFIRMED)
    await this.notificationService.sendJobNotificationToUser(request.extra.user.id, "job-request-confirmed-body", {
      type: "job-request-confirmed",
      job_offer: jobOffer,
      job_request: newRequest
    });
  }

  async finishWork(userId: string, request_id: string, verification_code: number) {
    const jobOffer = await this.jobOfferService.findJobOfferWithRequests({ requests: { id: request_id } });
    if (jobOffer.company.employer.user.id !== userId) {
      throw new HttpException("You are not the employer of this company", 403);
    }
    if (!jobOffer) {
      throw new HttpException("Job offer not found for this request id", 404);
    }

    const request = jobOffer.requests.find(request => request.id === request_id);
    if (!request) {
      throw new HttpException("Request not found", 404);
    } else if (request.status !== JobRequestStatus.WAITING_FOR_VERIFICATION) {
      throw new HttpException("Request is not waiting for verification", 400);
    }

    console.log("VERIFICATION CODE ON REQUEST : " + request.verification_code);
    console.log("VERIFICATION CODE ON PARAMETER : " + verification_code);
    if (Number(request.verification_code) !== Number(verification_code)) {
      throw new HttpException("Invalid verification code", 400);
    }
    const newRequest: ExtraJobRequestEntity = request;
    try {
      await this.extraJobRequestService.update(request.id, {
        status: JobRequestStatus.FINISHED,
        verification_code: null
      });
    } catch (e) {
      throw new HttpException("Error while finishing request", 500);
    }
    newRequest.status = JobRequestStatus.FINISHED;
    newRequest.verification_code = null;

    // NOTIFICATION : SEND NOTIFICATION TO EXTRA (JOB-REQUEST-FINISHED)
    await this.notificationService.sendJobNotificationToUser(request.extra.user.id, "job-request-finished-body", {
      type: "job-request-finished",
      job_offer: jobOffer,
      job_request: newRequest
    });
  }

  async getStatistics(userId: string) {
    const employer = await this.getEmployerWithCompanies(userId);
    if (!employer) {
      throw new HttpException("Employer not found", 404);
    }
    const companies = employer.companies;
    const jobOffers = companies.flatMap(company => company.jobOffers);
    const jobRequests = jobOffers.flatMap(jobOffer => jobOffer.requests);

    const totalJobOffers = jobOffers.length;
    const totalJobRequests = jobRequests.length;
    const totalAcceptedJobRequests = jobRequests.filter(request => request.status === JobRequestStatus.ACCEPTED).length;
    const totalFinishedJobRequests = jobRequests.filter(request => request.status === JobRequestStatus.FINISHED).length;
    const totalRejectedJobRequests = jobRequests.filter(request => request.status === JobRequestStatus.REJECTED).length;
    const totalWaitingForVerificationJobRequests = jobRequests.filter(request => request.status === JobRequestStatus.WAITING_FOR_VERIFICATION).length;
    const totalFinishedJobOffers = jobOffers.filter(jobOffer => moment(jobOffer.starting_date).add(jobOffer.working_hours, "hours").isBefore(moment())).length;

    return {
      total_job_offers: totalJobOffers,
      total_job_requests: totalJobRequests,
      total_finished_job_offers: totalFinishedJobOffers,
      total_accepted_job_requests: totalAcceptedJobRequests,
      total_finished_job_requests: totalFinishedJobRequests,
      total_rejected_job_requests: totalRejectedJobRequests,
      total_waiting_job_requests: totalWaitingForVerificationJobRequests
    };
  }

  async deleteJobOffer(userId: string, jobOfferId: string) {
    const employer = await this.getEmployerWithCompanies(userId);
    if (!employer) {
      throw new HttpException("Employer not found", 404);
    }
    const companies = employer.companies;
    const jobOffer = companies.flatMap(company => company.jobOffers).find(jobOffer => jobOffer.id === jobOfferId);
    if (!jobOffer) {
      throw new HttpException("Job offer not found", 404);
    }
    if (jobOffer.company.employer.user.id !== userId) {
      throw new HttpException("You are not the employer of this company", 403);
    }
    try {
      await this.jobOfferService.remove(jobOfferId);
    } catch (e) {
      throw new HttpException("Error while deleting job offer", 500);
    }
  }

  private async setJobOfferExpired(jobOffer: JobOfferEntity) {
    await this.jobOfferService.updateAvailable(jobOffer.id, false);
    const requestIdsToReject = await this.extraJobRequestService.findAllJobRequestsByJobOfferId(jobOffer.id)
      .then(requests => requests.filter(request => request.status === JobRequestStatus.PENDING)
        .map(request => request.id));
    if (requestIdsToReject.length === 0) {
      return;
    }
    return await this.extraJobRequestService.rejectRemainingRequests(requestIdsToReject);
  }
}
