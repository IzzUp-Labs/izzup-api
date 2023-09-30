import { ApiProperty } from "@nestjs/swagger";
import { EmployerEntity } from "../../employer/entities/employer.entity";
import { ExtraEntity } from "../../extra/entities/extra.entity";
import { CreateUserStatusDto } from "../../user-status/dto/create-user-status.dto";
import {DeviceEntity} from "../../device/entities/device.entity";

export class CreateUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  date_of_birth: Date;
  @ApiProperty()
  role: string;
  @ApiProperty()
  employer?: EmployerEntity;
  @ApiProperty()
  extra?: ExtraEntity;
  @ApiProperty()
  statuses?: CreateUserStatusDto[];
  @ApiProperty()
  device?: DeviceEntity;
}
