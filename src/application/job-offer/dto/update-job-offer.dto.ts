import { PartialType } from "@nestjs/mapped-types";
import { JobOfferDto } from "./job-offer.dto";

export class UpdateJobOfferDto extends PartialType(JobOfferDto) {
}