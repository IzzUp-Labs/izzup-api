import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";
import { MessagingGateway } from "./messaging.gateway";
import { UserModule } from "../user/user.module";
import { MessagingSessionEntity } from "./entities/messaging-session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagingEntity } from "./entities/messaging.entity";
import { MessagingRoomModule } from "./messaging-room.module";
import { ParamCheckModule } from "../../domain/middleware/param-check/param-check.module";
import {NotificationModule} from "../notification/notification.module";

@Module({
  imports: [TypeOrmModule.forFeature([MessagingEntity, MessagingSessionEntity]), UserModule, MessagingRoomModule, ParamCheckModule, NotificationModule],
  providers: [MessagingGateway, MessagingService]
})
export class MessagingModule {
}
