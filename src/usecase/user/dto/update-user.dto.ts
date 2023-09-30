import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import {DeviceEntity} from "../../device/entities/device.entity";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email_confirmation_code?: number;
  is_email_confirmed?: boolean;
  email?: string;
  device?: DeviceEntity;
}
