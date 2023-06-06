import { Controller, Headers, Param, Post, UseGuards } from "@nestjs/common";
import { ExtraJobRequestService } from "../../domain/services/extra/extra-job-request.service";
import { AuthGuard } from "@nestjs/passport";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { ParamCheckService } from "../../domain/middleware/param-check/param-check.service";

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

  @RoleGuard(RoleEnum.EXTRA)
  @UseGuards(AuthGuard('jwt'))
  @Post(":jobOfferId")
  create(@Param("jobOfferId") jobOfferId: string, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.extraJobRequestService.create(+jobOfferId, userId);
  }
}