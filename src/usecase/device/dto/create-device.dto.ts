import {ApiProperty} from "@nestjs/swagger";

export class CreateDeviceDto {
    @ApiProperty()
    device_id: string;
    @ApiProperty()
    fcm_token: string;
}
