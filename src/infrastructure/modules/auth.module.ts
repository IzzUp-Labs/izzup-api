import { Module } from "@nestjs/common";
import { AuthService } from "../../domain/services/auth/auth.service";
import { AuthController } from "../../application/auth/auth.controller";
import { UserModule } from "./user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../../domain/strategies/jwt.strategy";
import { ExtraModule } from "./extra.module";

@Module({
  imports: [
    UserModule,
    ExtraModule,
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
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {
}
