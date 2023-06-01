import { Module } from '@nestjs/common';
import { UserSeedService } from './user-seed.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
