import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserStatusModule } from "../user-status/user-status.module";
import { ParamCheckModule } from "../../domain/middleware/param-check/param-check.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserStatusModule, ParamCheckModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}
