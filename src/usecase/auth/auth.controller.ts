import {Body, Controller, Delete, Headers, HttpCode, HttpStatus, Post, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterExtraDto } from "./dto/auth-register-extra.dto";
import { AuthRegisterEmployerDto } from "./dto/auth-register-employer.dto";
import { AuthMembershipCheckDto } from "./dto/auth-membership-check.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";

@ApiTags("Authentications")
@Controller({
  path: "auth",
  version: "1"
})
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly paramCheckService: ParamCheckService
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.validateLogin(authLoginDto);
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Delete("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.authService.logout(userId);
  }
}
