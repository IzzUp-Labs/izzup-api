import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "../../domain/services/auth/auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterExtraDto } from "./dto/auth-register-extra.dto";
import { AuthRegisterEmployerDto } from "./dto/auth-register-employer.dto";
import { AuthMembershipCheckDto } from "./dto/auth-membership-check.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Authentications')
@Controller({
  path: "auth",
  version: "1"
})
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.validateLogin(authLoginDto);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.register(authLoginDto);
  }

  @Post("check")
  @HttpCode(HttpStatus.OK)
  isMember(@Body() authMembershipCheckDto: AuthMembershipCheckDto) {
    return this.authService.isMember(authMembershipCheckDto);
  }

  @Post("register/extra")
  @HttpCode(HttpStatus.CREATED)
  registerExtra(@Body() authRegisterExtraDto: AuthRegisterExtraDto) {
    return this.authService.registerExtra(authRegisterExtraDto);
  }

  @Post("register/employer")
  @HttpCode(HttpStatus.CREATED)
  registerEmployer(@Body() authRegisterEmployerDto: AuthRegisterEmployerDto) {
    return this.authService.registerEmployer(authRegisterEmployerDto);
  }

}
