import { ApiProperty } from "@nestjs/swagger";

export class ActivitySectorDto {
  @ApiProperty({ required: false })
  id?: string;
  @ApiProperty()
  name: string;
}
