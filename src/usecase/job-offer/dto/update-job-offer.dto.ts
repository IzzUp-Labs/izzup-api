import { PartialType } from "@nestjs/swagger";
import { JobOfferDto } from "./job-offer.dto";

export class UpdateJobOfferDto extends PartialType(JobOfferDto) {
}