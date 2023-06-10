import { JobRequestStatus } from "../../../domain/utils/enums/job-request-status";

export class ExtraJobRequestDto {
  extraId: number;
  status: JobRequestStatus;
}