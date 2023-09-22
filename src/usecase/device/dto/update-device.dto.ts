import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from './create-device.dto';
import {ApiProperty} from "@nestjs/swagger";
import {UserEntity} from "../../user/entities/user.entity";

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
    @ApiProperty()
    device_id: string;
    @ApiProperty()
    fcm_token: string;
    @ApiProperty()
    device_language: string;
    @ApiProperty()
    user: UserEntity;
}
