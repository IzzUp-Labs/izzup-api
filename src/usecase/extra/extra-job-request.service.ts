import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtraJobRequestEntity } from "./entities/extra-job-request.entity";
import { Repository } from "typeorm";
import { JobOfferService } from "../job-offer/job-offer.service";
import { ExtraJobRequestDto } from "./dto/extra-job-request.dto";
import { JobRequestStatus } from "../../domain/utils/enums/job-request-status";
import { ExtraService } from "./extra.service";
import {JobOfferEntity} from "../job-offer/entities/job-offer.entity";
import * as moment from 'moment';

@Injectable()
export class ExtraJobRequestService {
  constructor(
    @InjectRepository(ExtraJobRequestEntity)
    private readonly extraJobRequestRepository: Repository<ExtraJobRequestEntity>,
    private readonly jobOfferService: JobOfferService,
    private readonly extraService: ExtraService
  ) {}

  async create(jobOfferId: number, userId: number) {
    const jobOffer = await this.jobOfferService.findJobOfferWithRequests({ id: jobOfferId });
    if (jobOffer == null)
      throw new HttpException('Job offer not found', 404);
    if (!jobOffer.is_available)
      throw new HttpException('Job offer is not available', 400);
    const extra = await this.extraService.findExtraWithRequestsAndJobOffers({ user: { id: userId } });

    if (extra == null)
      throw new HttpException('Extra not found', 404);

    const currentStartingDate = moment(jobOffer.starting_date);
    const currentEndingDate = moment(jobOffer.starting_date).add(jobOffer.working_hours, 'hours');

    extra.requests.forEach(request => {
        const requestStartingDate = moment(request.jobOffer.starting_date);
        const requestEndingDate = moment(request.jobOffer.starting_date).add(request.jobOffer.working_hours, 'hours');

        if (
            requestStartingDate.isBefore(currentEndingDate) &&
            requestEndingDate.isAfter(currentStartingDate) &&
            request.status === JobRequestStatus.ACCEPTED
        ) {
            throw new HttpException('Already have a request accepted at the same time', 400);
        }
    });

    jobOffer.requests.forEach(request => {
        if (request.extra.id == extra.id)
            throw new HttpException('Job request already exists', 400);
    });

    await this.extraJobRequestRepository.save({
        status: JobRequestStatus.PENDING,
        extra,
        jobOffer
    });
  }

  findAllJobRequestsByJobOfferId(jobOfferId: number) {
    return this.extraJobRequestRepository.find({
      relations: ['extra'],
      where: {
        jobOffer: {
          id: jobOfferId
        }
      }
    });
  }

  update(id: number, extraJobRequestDto: ExtraJobRequestDto) {
    return this.extraJobRequestRepository.createQueryBuilder("extraJobRequest")
      .update(ExtraJobRequestEntity)
      .set(extraJobRequestDto)
      .where("id = :id", { id })
      .execute();
  }

  rejectRemainingRequests(requestIds: number[]) {
    return this.extraJobRequestRepository.createQueryBuilder()
      .update(ExtraJobRequestEntity)
      .set({ status: JobRequestStatus.REJECTED })
      .where('id IN (:...ids)', { ids: requestIds })
      .execute();
  }

  async rejectExtraRequestWhenAccepted(extraId: number, jobOffer: JobOfferEntity) {
      const extraWithRequests = await this.extraService.findExtraWithRequestsAndJobOffers({ id: extraId });
      extraWithRequests.requests.forEach(request => {
          const currentStartingDate = moment(jobOffer.starting_date);
          const currentEndingDate = moment(jobOffer.starting_date).add(jobOffer.working_hours, 'hours');
          const requestStartingDate = moment(request.jobOffer.starting_date);
          const requestEndingDate = moment(request.jobOffer.starting_date).add(request.jobOffer.working_hours, 'hours');

          if (
              requestStartingDate.isBefore(currentEndingDate) &&
              requestEndingDate.isAfter(currentStartingDate) &&
              request.status === JobRequestStatus.PENDING
          ) {
              // Update status to REJECTED
              this.update(request.id, { status: JobRequestStatus.REJECTED });
          }
      });
  }

}