import {Controller, Get, Headers, Param, Post, UseGuards} from "@nestjs/common";
import {ExtraJobRequestService} from "./extra-job-request.service";
import {AuthGuard} from "@nestjs/passport";
import {RoleEnum} from "../../domain/utils/enums/role.enum";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {StatusGuard} from "../../domain/guards/status.decorator";
import {UserStatusEnum} from "../../domain/utils/enums/user-status.enum";

@ApiTags('Extra Job Requests')
@Controller({
  path: "extra-job-request",
  version: "1"
})
export class ExtraJobRequestController {
  constructor(
    private readonly extraJobRequestService: ExtraJobRequestService,
    private readonly paramCheckService: ParamCheckService
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EXTRA])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Post(":jobOfferId")
  create(@Param("jobOfferId") jobOfferId: string, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.extraJobRequestService.create(+jobOfferId, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER, RoleEnum.ADMIN])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Get(":jobOfferId")
  findAllJobRequestsByJobOfferId(@Param("jobOfferId") jobOfferId: string) {
    return this.extraJobRequestService.findAllJobRequestsByJobOfferId(+jobOfferId);
  }
}