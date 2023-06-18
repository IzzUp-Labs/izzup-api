import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserStatusSeedService } from "./user-status-seed.service";
import { UserStatusEntity } from "../../../../usecase/user-status/entities/user-status.entity";

@Module( {
  imports: [TypeOrmModule.forFeature( [UserStatusEntity])],
  providers: [UserStatusSeedService],
  exports: [UserStatusSeedService],
})
export class UserStatusSeedModule {}