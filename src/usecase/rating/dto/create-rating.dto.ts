import {ApiProperty} from "@nestjs/swagger";

export class CreateRatingDto {
    @ApiProperty()
    stars?: number;
    @ApiProperty()
    target_id!: string;
    @ApiProperty()
    comment?: string;
    @ApiProperty()
    badges?: string[];
}
