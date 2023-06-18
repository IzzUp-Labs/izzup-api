import {ApiProperty} from "@nestjs/swagger";
import {EmployerEntity} from "../../employer/entities/employer.entity";

export class CompanyDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  employer: EmployerEntity;
}