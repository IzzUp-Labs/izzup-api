import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { ConfigService } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { ParamCheckModule } from "../../domain/middleware/param-check/param-check.module";
import { JobOfferModule } from "../job-offer/job-offer.module";
import { ExtraJobRequestModule } from "../extra/extra-job-request.module";

@Module({
  imports: [UserModule, ParamCheckModule, JobOfferModule, ExtraJobRequestModule],
  controllers: [MailingController],
  providers: [MailingService, ConfigService]
})
export class MailingModule {}
