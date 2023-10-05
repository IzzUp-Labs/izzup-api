import {ApiProperty} from "@nestjs/swagger";
import {UserEntity} from "../../user/entities/user.entity";

export class CreateDeviceDto {
    @ApiProperty()
    device_id: string;
    @ApiProperty()
    fcm_token: string;
    @ApiProperty()
    device_language: string;
    @ApiProperty()
    notification_enabled: boolean;
    @ApiProperty()
    user: UserEntity;
}
