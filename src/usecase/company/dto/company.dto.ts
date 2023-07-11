import { ApiProperty } from "@nestjs/swagger";
import { EmployerEntity } from "../../employer/entities/employer.entity";
import { LocationEntity } from "../../location/entities/location.entity";

export class CompanyDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  place_id: string;
  @ApiProperty()
  location: LocationEntity;
  @ApiProperty()
  employer: EmployerEntity;
}
