import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../../domain/services/auth/auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.validateLogin(authLoginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.register(authLoginDto);
  }

}
