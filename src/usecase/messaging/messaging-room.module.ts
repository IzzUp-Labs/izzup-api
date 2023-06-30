import { Module } from '@nestjs/common';
import { MessagingRoomService } from './messaging-room.service';
import { MessagingRoomController } from './messaging-room.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MessagingRoomEntity} from "./entities/messaging-room.entity";
import {UserModule} from "../user/user.module";
import {ParamCheckModule} from "../../domain/middleware/param-check/param-check.module";

@Module({
  imports: [TypeOrmModule.forFeature([MessagingRoomEntity]), UserModule, ParamCheckModule],
  controllers: [MessagingRoomController],
  providers: [MessagingRoomService],
  exports: [MessagingRoomService],
})
export class MessagingRoomModule {}
