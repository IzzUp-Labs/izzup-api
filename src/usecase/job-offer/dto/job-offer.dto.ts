import {ApiProperty} from "@nestjs/swagger";

export class JobOfferDto {
    @ApiProperty()
    job_title: string;
    @ApiProperty()
    price: number;
    @ApiProperty()
    is_available: boolean;
    @ApiProperty()
    spots: number;
}