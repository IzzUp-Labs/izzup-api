import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { EmployerService } from "../../domain/services/employer/employer.service";
import { UpdateEmployerDto } from "./dto/update-employer.dto";

@Controller({
  path: "employer",
  version: "1"
})
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {
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
}
