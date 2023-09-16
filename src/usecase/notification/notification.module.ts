import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import {UserModule} from "../user/user.module";
import {ParamCheckModule} from "../../domain/middleware/param-check/param-check.module";

@Module({
  imports: [UserModule, ParamCheckModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {
}
