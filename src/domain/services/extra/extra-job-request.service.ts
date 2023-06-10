import { HttpException, Injectable } from "@nestjs/common";
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
    const jobOffer = await this.jobOfferService.findOneWithRelations({ id: jobOfferId });
    if(jobOffer != null) {
      if(jobOffer.is_available) {
        const extra = await this.extraService.findOne({ user_id: userId });
        for(const request of jobOffer.requests) {
          if(request.extraId == extra.id) {
            throw new HttpException('Job request already exists', 400);
          }
        }
        const extraJobRequestDto : ExtraJobRequestDto = {
          extraId: extra.id,
          status: JobRequestStatus.PENDING
        };
        const createdRequest = await this.extraJobRequestRepository.save(
          this.extraJobRequestRepository.create(extraJobRequestDto)
        );
        jobOffer.requests.push(createdRequest);
        return await this.jobOfferService.update(jobOfferId, jobOffer);
      }
      else {
        throw new HttpException('Job offer is not available', 400);
      }
    }
    else {
      throw new HttpException('Job offer not found', 404);
    }
  }

  update(id: number, extraJobRequestDto: ExtraJobRequestDto) {
    return this.extraJobRequestRepository.save(
      this.extraJobRequestRepository.create({
        id,
        ...extraJobRequestDto
      })
    );
  }
}