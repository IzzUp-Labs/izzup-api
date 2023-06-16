import {ApiProperty} from "@nestjs/swagger";

export class CompanyDto {
  @ApiProperty()
  employer_id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
}