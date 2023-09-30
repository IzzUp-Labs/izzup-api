import { Module } from "@nestjs/common";
import { JobRequestTaskService } from "./job-request-task.service";
import { JobOfferModule } from "../job-offer/job-offer.module";
import { ExtraJobRequestModule } from "../extra/extra-job-request.module";
import {NotificationModule} from "../notification/notification.module";

@Module({
  imports: [JobOfferModule, ExtraJobRequestModule, NotificationModule],
  providers: [JobRequestTaskService],
  exports: [JobRequestTaskService]
})
export class JobRequestTaskModule {
}
