import {ApiProperty} from "@nestjs/swagger";

export class JobOfferDto {
    @ApiProperty()
    job_title: string;
    @ApiProperty()
    job_description: string;
    @ApiProperty()
    starting_date: Date;
    @ApiProperty()
    working_hours: number;
    @ApiProperty()
    price: number;
    @ApiProperty()
    is_available: boolean;
    @ApiProperty()
    spots: number;
    @ApiProperty()
    acceptedSpots: number;
}