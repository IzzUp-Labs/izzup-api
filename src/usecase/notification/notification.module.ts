import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import {ParamCheckModule} from "../../domain/middleware/param-check/param-check.module";
import {DeviceModule} from "../device/device.module";

@Module({
  imports: [ParamCheckModule, DeviceModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {
}
