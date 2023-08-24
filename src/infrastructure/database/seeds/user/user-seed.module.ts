import { Module } from "@nestjs/common";
import { UserSeedService } from "./user-seed.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../../usecase/user/entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import seedUserConfig from "../../../config/seed-user.config";
import { EmployerEntity } from "../../../../usecase/employer/entities/employer.entity";
import { ExtraEntity } from "../../../../usecase/extra/entities/extra.entity";
import { ExtraJobRequestEntity } from "../../../../usecase/extra/entities/extra-job-request.entity";
import { JobOfferEntity } from "../../../../usecase/job-offer/entities/job-offer.entity";
import { CompanyEntity } from "../../../../usecase/company/entities/company.entity";
import { UserStatusEntity } from "../../../../usecase/user-status/entities/user-status.entity";
import { LocationEntity } from "../../../../usecase/location/entities/location.entity";
import { MessagingRoomEntity } from "../../../../usecase/messaging/entities/messaging-room.entity";
import { MessagingEntity } from "../../../../usecase/messaging/entities/messaging.entity";
import { MessagingSessionEntity } from "../../../../usecase/messaging/entities/messaging-session.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, EmployerEntity, ExtraEntity, ExtraJobRequestEntity, JobOfferEntity, CompanyEntity,
      UserStatusEntity, LocationEntity, MessagingRoomEntity, MessagingEntity, MessagingSessionEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [seedUserConfig],
      envFilePath: [".env"]
    })],
  providers: [UserSeedService],
  exports: [UserSeedService]
})
export class UserSeedModule {
}
