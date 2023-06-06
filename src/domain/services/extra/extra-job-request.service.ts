import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtraJobRequestEntity } from "../../../infrastructure/entities/extra-job-request.entity";
import { Repository } from "typeorm";
import { JobOfferService } from "../job-offer/job-offer.service";
import { ExtraJobRequestDto } from "../../../application/extra/dto/extra-job-request.dto";
import { JobRequestStatus } from "../../utils/enums/job-request-status";
import { ExtraService } from "./extra.service";

@Injectable()
export class ExtraJobRequestService {
  constructor(
    @InjectRepository(ExtraJobRequestEntity)
    private readonly extraJobRequestRepository: Repository<ExtraJobRequestEntity>,
    private readonly jobOfferService: JobOfferService,

    private readonly extraService: ExtraService
  ) {}

  async create(jobOfferId: number, userId: number) {
    const extra = await this.extraService.findOne({ user_id: userId });
    const extraJobRequestDto : ExtraJobRequestDto = {
      extraId: extra.id,
      status: JobRequestStatus.PENDING
    };
    const jobOffer = await this.jobOfferService.findOne({ id: jobOfferId });
    const createdRequest = await this.extraJobRequestRepository.save(
      this.extraJobRequestRepository.create(extraJobRequestDto)
    );
    jobOffer.requests = [createdRequest];
    return await this.jobOfferService.update(jobOfferId, jobOffer);
  }
}