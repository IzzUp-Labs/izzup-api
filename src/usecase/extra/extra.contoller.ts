import {Body, Controller, Delete, Get, Param, Patch, UseGuards, Headers} from "@nestjs/common";
import {ExtraService} from "./extra.service";
import {UpdateExtraDto} from "./dto/update-extra.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {RoleEnum} from "../../domain/utils/enums/role.enum";
import {AuthGuard} from "@nestjs/passport";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";

@ApiTags('Extras')
@Controller({
  path: "extra",
  version: "1"
})
export class ExtraController {
  constructor(
      private readonly extraService: ExtraService,
      private readonly paramCheckService: ParamCheckService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.extraService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.extraService.findOne({ id: +id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EXTRA])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateExtraDto: UpdateExtraDto) {
    return this.extraService.update(+id, updateExtraDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EXTRA])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.extraService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EXTRA])
  @Patch(":id/tag/:tagId")
  addTag(@Param("id") id: string, @Param("tagId") tagId: string) {
    return this.extraService.addTag(+id, +tagId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EXTRA])
  @Patch("add/tags")
  addTags(@Body() tagsIds: number[], @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization)
    return this.extraService.addTags(+userId, tagsIds);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EXTRA])
  @Delete(":id/tag/:tagId")
  removeTag(@Param("id") id: string, @Param("tagId") tagId: string) {
    return this.extraService.removeTag(+id, +tagId);
  }
}
