import { Module } from '@nestjs/common';
import { AuthService } from '../../domain/services/auth/auth.service';
import { AuthController } from '../../application/auth/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
