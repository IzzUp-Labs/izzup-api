import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserStatusModule } from "../user-status/user-status.module";
import { ParamCheckModule } from "../../domain/middleware/param-check/param-check.module";
import { FileExtensionChecker } from "../../domain/utils/file-extension-checker/file-extension-checker";
import {DeviceModule} from "../device/device.module";
import {NotificationModule} from "../notification/notification.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserStatusModule, ParamCheckModule, DeviceModule, NotificationModule],
  controllers: [UserController],
  providers: [UserService, FileExtensionChecker],
  exports: [UserService]
})
export class UserModule {
}
