import {ApiProperty} from "@nestjs/swagger";

export class CreateRatingDto {
    @ApiProperty()
    stars?: number | null;
    @ApiProperty()
    target_id!: string;
    @ApiProperty()
    comment?: string;
    @ApiProperty()
    badges?: string[] | null;
}
