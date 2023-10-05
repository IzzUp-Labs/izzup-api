import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../../domain/strategies/jwt.strategy";
import { ExtraModule } from "../extra/extra.module";
import { CompanyModule } from "../company/company.module";
import { EmployerModule } from "../employer/employer.module";
import { LocationModule } from "../location/location.module";
import {DeviceModule} from "../device/device.module";
import {ParamCheckModule} from "../../domain/middleware/param-check/param-check.module";

@Module({
  imports: [
    UserModule,
    ExtraModule,
    EmployerModule,
    CompanyModule,
    LocationModule,
    DeviceModule,
    ParamCheckModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("auth.secret"),
        signOptions: {
          expiresIn: configService.get("auth.expires")
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
