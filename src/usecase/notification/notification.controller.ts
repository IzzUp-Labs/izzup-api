import {Controller, Get, Headers, UseGuards} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";

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
  sendNotificationToUser(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    this.notificationService.sendNotificationToUser(userId);
  }
}
