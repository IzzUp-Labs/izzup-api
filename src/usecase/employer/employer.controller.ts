import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import {EmployerService} from "./employer.service";
import {UpdateEmployerDto} from "./dto/update-employer.dto";
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {RoleEnum} from "../../domain/utils/enums/role.enum";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {StatusGuard} from "../../domain/guards/status.decorator";
import {UserStatusEnum} from "../../domain/utils/enums/user-status.enum";

@ApiTags('Employers')
@Controller({
  path: "employer",
  version: "1"
})
export class EmployerController {
  constructor(private readonly employerService: EmployerService,
              private readonly paramCheckService: ParamCheckService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.employerService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Get("statistics")
  getStatistics(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.getStatistics(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.employerService.findOne({ id: +id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EMPLOYER])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEmployerDto: UpdateEmployerDto) {
    return this.employerService.update(+id, updateEmployerDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EMPLOYER])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.employerService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Post(":id/job-offer/:companyId")
  createJobOffer(@Param("id") id: string, @Param("companyId") companyId: string, @Body() jobOfferDto, @Headers("Authorization") authorization: string) {
    const result = this.paramCheckService.check(authorization, +id)
      if(result) {
        return this.employerService.createJobOffer(+id, jobOfferDto, +companyId);
      }
      else {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            reason: "Invalid user"
          },
          HttpStatus.UNAUTHORIZED
        );
      }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Get("my/joboffers")
  getMyJobOffers(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.getMyJobOffers(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @Get("my/company")
  getMyCompany(@Headers("Authorization") authorization: string) {
    const result = this.paramCheckService.decodeId(authorization);
    if(result) {
      return this.employerService.getEmployerWithCompanies(result);
    }
    else {
      throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            reason: "Invalid user"
          },
          HttpStatus.UNAUTHORIZED
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Get("my/jobOffers/requests")
  findMyJobOffersWithRequests(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.getMyJobOffersWithExtraUsers(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Patch("accept/request/:requestId")
  acceptExtraJobRequest(@Param("requestId") requestId, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.acceptExtraJobRequest(userId, +requestId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Patch("reject/request/:requestId")
  rejectExtraJobRequest(@Param("requestId") requestId, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.rejectExtraJobRequest(userId, +requestId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Patch("comfirm-work/:requestId")
  confirmWork(@Param("requestId") requestId, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.confirmWork(userId, +requestId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER])
  @StatusGuard(UserStatusEnum.VERIFIED)
  @Patch("finish-work/:requestId/:code")
  finishWork(@Param("requestId") requestId, @Param("code") code,@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.finishWork(userId, +requestId, +code);
  }
}
