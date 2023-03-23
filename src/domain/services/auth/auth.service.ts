import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from '../../../application/auth/dto/login-auth.dto';

@Injectable()
export class AuthService {
  create(createAuthDto: LoginAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
}
