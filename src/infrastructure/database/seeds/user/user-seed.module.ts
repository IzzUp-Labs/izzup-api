import { Module } from '@nestjs/common';
import { UserSeedService } from './user-seed.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import seedUserConfig from "../../../config/seed-user.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [seedUserConfig],
      envFilePath: ["env/local.env"],
    }),],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
