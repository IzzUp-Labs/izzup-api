import { Module } from '@nestjs/common';
import { UserService } from '../../domain/services/user/user.service';
import { UserController } from '../../application/user/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
