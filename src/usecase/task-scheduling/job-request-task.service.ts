import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { JobOfferService } from "../job-offer/job-offer.service";
import { ExtraJobRequestService } from "../extra/extra-job-request.service";
import { JobRequestStatus } from "../../domain/utils/enums/job-request-status";
import * as moment from "moment";
import {NotificationService} from "../notification/notification.service";

@Injectable()
export class JobRequestTaskService {
  private readonly logger = new Logger(JobRequestTaskService.name);

  constructor(
    private readonly jobOfferService: JobOfferService,
    private readonly extraJobRequestService: ExtraJobRequestService,
    private readonly notificationService: NotificationService
  ) {
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkJobOffersRequest() {
    this.logger.log("Called every minute");
    const jobOffers = await this.jobOfferService.findAll();
    if (!jobOffers) return;
    const now = moment();
    for (const jobOffer of jobOffers) {
      const startingDate = moment(jobOffer.starting_date);
      if (startingDate.isBefore(now) && jobOffer.is_available == true) {
        await this.jobOfferService.updateAvailable(jobOffer.id, false);
        jobOffer.is_available = false;
      }
      for (const request of jobOffer.requests) {
        if (request.status == JobRequestStatus.ACCEPTED && moment(jobOffer.starting_date).add(jobOffer.working_hours, "hours").isBefore(now)) {
          const updatedRequest = request;
          const verification_code = Math.floor(1000 + Math.random() * 9000);
          await this.extraJobRequestService.update(request.id, {
            status: JobRequestStatus.WAITING_FOR_VERIFICATION,
            verification_code: verification_code
          });
          updatedRequest.status = JobRequestStatus.WAITING_FOR_VERIFICATION;
          updatedRequest.verification_code = verification_code;

          // NOTIFICATION : SEND NOTIFICATION TO EXTRA (JOB-REQUEST-CONFIRMED)
          await this.notificationService.sendJobNotificationToUser(request.extra.user.id, "job-request-confirmed-body", {
              type: "job-request-confirmed",
              verification_code: verification_code,
              request_id: request.id,
              user_id: jobOffer.company.employer.user.id
          });
          // NOTIFICATION : SEND NOTIFICATION TO EMPLOYER (JOB-REQUEST-CONFIRMED)
          await this.notificationService.sendJobNotificationToUser(jobOffer.company.employer.user.id, "job-request-confirmed-employer-body", {
              type: "job-request-confirmed",
              verification_code: verification_code,
              request_id: request.id,
              user_name: request.extra.user.first_name + " " + request.extra.user.last_name,
              user_id: request.extra.user.id
          });
        }
      }
    }
  }
}
