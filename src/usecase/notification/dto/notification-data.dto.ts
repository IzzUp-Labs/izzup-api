import {ExtraJobRequestEntity} from "../../extra/entities/extra-job-request.entity";
import {JobOfferEntity} from "../../job-offer/entities/job-offer.entity";

export class NotificationDataDto{
    message?: string | null;
    type?: string | null;
    job_title?: string | null;
    starting_date?: Date | null;
    verification_code?: number | null;
    request_id?: string | null;
    job_offer?: JobOfferEntity | null;
    job_request?: ExtraJobRequestEntity | null;
    room_id?: string | null;
}