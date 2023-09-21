import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from './create-device.dto';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
    @ApiProperty()
    device_id: string;
    @ApiProperty()
    fcm_token: string;
}
