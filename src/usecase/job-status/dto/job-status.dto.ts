import { ApiProperty } from "@nestjs/swagger";

export class JobStatusDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  status: string;
}
