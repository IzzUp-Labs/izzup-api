import { Module } from "@nestjs/common";
import { ParamCheckService } from "../../domain/middleware/param-check/param-check.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [ParamCheckService, JwtService],
  exports: [ParamCheckService]
})
export class ParamCheckModule {
}