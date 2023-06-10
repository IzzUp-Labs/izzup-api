import { JobStatusDto } from "./job-status.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateJobStatusDto extends PartialType(JobStatusDto) {

}