import { ApiProperty } from "@nestjs/swagger";

export class CreateLocationDto {
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  latitude: number;
}
