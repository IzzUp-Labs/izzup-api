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
import { EmployerService } from "./employer.service";
import { UpdateEmployerDto } from "./dto/update-employer.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { ParamCheckService } from "../../domain/middleware/param-check/param-check.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags('Employers')
@Controller({
  path: "employer",
  version: "1"
})
export class EmployerController {
  constructor(private readonly employerService: EmployerService,
              private readonly paramCheckService: ParamCheckService) {
  }

  @Get()
  findAll() {
    return this.employerService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.employerService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEmployerDto: UpdateEmployerDto) {
    return this.employerService.update(+id, updateEmployerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.employerService.remove(+id);
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.EMPLOYER)
  @UseGuards(AuthGuard('jwt'))
  @Post(":id/job-offer")
  createJobOffer(@Param("id") id: string, @Body() jobOfferDto, @Headers("Authorization") authorization: string) {
    const result = this.paramCheckService.check(authorization, +id)
      if(result) {
        return this.employerService.createJobOffer(+id, jobOfferDto);
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
  @RoleGuard(RoleEnum.EMPLOYER)
  @UseGuards(AuthGuard('jwt'))
  @Get("my/joboffers")
  getMyJobOffers(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.findAllByAuthEmployer(userId);
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.EMPLOYER)
  @UseGuards(AuthGuard('jwt'))
  @Patch(":jobOfferId/accept/:extraId")
  acceptExtra(@Param("jobOfferId") jobOfferId: string, @Param("extraId") extraId: string, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.employerService.acceptExtraJobRequest(userId, +jobOfferId, +extraId);
  }
}
