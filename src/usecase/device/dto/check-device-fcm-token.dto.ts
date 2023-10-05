import {ApiProperty} from "@nestjs/swagger";

export class CheckDeviceFcmTokenDto {
    @ApiProperty()
    device_id: string;
    @ApiProperty()
    fcm_token: string;
    @ApiProperty()
    device_language: string;
    @ApiProperty()
    notification_enabled: boolean;
}