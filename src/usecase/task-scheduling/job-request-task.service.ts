import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import {JobOfferService} from "../job-offer/job-offer.service";
import {ExtraJobRequestService} from "../extra/extra-job-request.service";
import {JobRequestStatus} from "../../domain/utils/enums/job-request-status";
import {SocketService} from "../app-socket/socket.service";
import * as moment from 'moment';

@Injectable()
export class JobRequestTaskService {
  private readonly logger = new Logger(JobRequestTaskService.name);

  constructor(
      private readonly jobOfferService: JobOfferService,
      private readonly extraJobRequestService: ExtraJobRequestService,
      private readonly socketService: SocketService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkJobOffersRequest() {
    this.logger.log('Called every minute')
    const jobOffers= await this.jobOfferService.findAll();
    if (!jobOffers) return;
    const now = moment();
    for (const jobOffer of jobOffers) {
      const startingDate = moment(jobOffer.starting_date);
      if (startingDate.isBefore(now) && jobOffer.is_available == true) {
        await this.jobOfferService.updateAvailable(jobOffer.id, false);
        jobOffer.is_available = false;
      }
      for (let request of jobOffer.requests) {
        if (request.status == JobRequestStatus.ACCEPTED && moment(jobOffer.starting_date).add(jobOffer.working_hours, 'hours').isBefore(now)) {
          request = await this.extraJobRequestService.update(request.id, {
            status: JobRequestStatus.WAITING_FOR_VERIFICATION,
            verification_code: Math.floor(1000 + Math.random() * 9000)
          });
          //SOCKET : EMIT EVENT "JOB-REQUEST-CONFIRMED" FOR 2 CLIENTS
          const clientIdForExtra = await this.socketService.findClientByUserId(request.extra.user.id);
          const clientIdForCompany = await this.socketService.findClientByUserId(jobOffer.company.employer.user.id);
          this.socketService.socket.to(clientIdForExtra).emit('job-request-confirmed', {
            jobOffer: jobOffer,
            request: request
          });
          this.socketService.socket.to(clientIdForCompany).emit('job-request-confirmed', {
            jobOffer: jobOffer,
            request: request
          });
        }
      }
    }
  }
}