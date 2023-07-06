import { Controller, Get, Headers, Param, Post, UseGuards } from "@nestjs/common";
import { MailingService } from './mailing.service';
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ParamCheckService } from "../../domain/middleware/param-check/param-check.service";

@Controller({
  path: 'mailing',
  version: '1'
})
export class MailingController {
  constructor(
    private readonly mailingService: MailingService,
    private readonly paramCheckService: ParamCheckService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('send-mail')
  public sendVerificationEmail(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    this.mailingService.sendVerificationEmail(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('check-code/:code')
  public checkVerificationCode(@Param("code") code:number, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    this.mailingService.checkVerificationCode(userId, code);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('change-email/:email')
  public changeEmail(@Param("email") email:string, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    this.mailingService.changeEmailToSendCode(userId, email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('send-problem/:requestId')
  public sendProblemEmail(@Param('requestId') requestId: number,@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    this.mailingService.sendProblemEmail(userId, requestId);
  }
}
