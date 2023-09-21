import {Body, Controller, Get, Headers, UseGuards} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";
import {CreateNotificationDto} from "./dto/create-notification.dto";

@ApiTags("Notification")
@Controller({
    path: "notification",
    version: "1"
})
export class NotificationController {
  constructor(
      private readonly notificationService: NotificationService,
      private readonly paramCheckService: ParamCheckService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("send")
  sendNotificationToUser(@Headers("Authorization") authorization: string, @Body() createNotificationDto: CreateNotificationDto) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.notificationService.sendJobNotificationToUser(userId, createNotificationDto.body, createNotificationDto.data);
  }
}
