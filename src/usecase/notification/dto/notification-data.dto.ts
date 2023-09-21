import {ExtraJobRequestEntity} from "../../extra/entities/extra-job-request.entity";
import {JobOfferEntity} from "../../job-offer/entities/job-offer.entity";

export class NotificationDataDto{
    message?: string | null;
    type?: string | null;
    job_request?: ExtraJobRequestEntity | null;
    job_offer?: JobOfferEntity | null;
}