import { Module } from '@nestjs/common';
import { UserService } from '../../domain/services/user/user.service';
import { UserController } from '../../application/user/user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
