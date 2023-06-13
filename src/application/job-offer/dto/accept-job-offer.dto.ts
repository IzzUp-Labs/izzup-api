import { ExtraJobRequestEntity } from "../../../infrastructure/entities/extra-job-request.entity";

export class AcceptJobOfferDto {
  company_id: number;
  job_title: string;
  price: number;
  is_available: boolean;
  spots: number;
  requests: ExtraJobRequestEntity[];
}