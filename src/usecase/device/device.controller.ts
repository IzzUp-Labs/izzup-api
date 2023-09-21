import {Controller, Post, Body, UseGuards, Headers} from '@nestjs/common';
import { DeviceService } from './device.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {CheckDeviceFcmTokenDto} from "./dto/check-device-fcm-token.dto";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";

@ApiTags("Device")
@Controller({
  path: "device",
  version: "1"
})
export class DeviceController {
  constructor(private readonly deviceService: DeviceService,
              private readonly paramCheckService: ParamCheckService) {

  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("check")
  checkFcmToken(@Body() checkUserFcmTokenDto: CheckDeviceFcmTokenDto, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.deviceService.checkFCMToken(userId, checkUserFcmTokenDto.device_id, checkUserFcmTokenDto.fcm_token, checkUserFcmTokenDto.device_language);
  }
}
