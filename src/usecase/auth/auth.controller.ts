import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterExtraDto } from "./dto/auth-register-extra.dto";
import { AuthRegisterEmployerDto } from "./dto/auth-register-employer.dto";
import { AuthMembershipCheckDto } from "./dto/auth-membership-check.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {RoleEnum} from "../../domain/utils/enums/role.enum";

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
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get("connected/devices")
  @HttpCode(HttpStatus.OK)
  async getConnectedDevices() {
    return await this.authService.getConnectedDevices();
  }
}
