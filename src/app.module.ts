import { Module } from "@nestjs/common";
import databaseConfig from "./infrastructure/config/database.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./infrastructure/config/app.config";
import { TypeOrmConfigService } from "./infrastructure/config/typeorm-config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./infrastructure/modules/user.module";
import { AuthModule } from "./infrastructure/modules/auth.module";
import authConfig from "./infrastructure/config/auth.config";
import { ExtraModule } from "./infrastructure/modules/extra.module";
import { RoleModule } from "./infrastructure/modules/role.module";
import { RolesGuard } from "./domain/guards/role.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        authConfig
      ],
      envFilePath: ["env/local.env"]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    ExtraModule,
    RoleModule
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {
}
