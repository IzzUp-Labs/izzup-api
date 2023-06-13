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
import { EmployerModule } from "./infrastructure/modules/employer.module";
import { CompanyModule } from "./infrastructure/modules/company.module";
import { ActivitySectorModule } from "./infrastructure/modules/activity-sector.module";
import { TagModule } from "./infrastructure/modules/tag.module";
import { JobOfferModule } from "./infrastructure/modules/job-offer.module";
import { JobStatusModule } from "./infrastructure/modules/job-status.module";
import { ExtraJobRequestModule } from "./infrastructure/modules/extra-job-request.module";

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
    RoleModule,
    EmployerModule,
    CompanyModule,
    ActivitySectorModule,
    TagModule,
    JobOfferModule,
    JobStatusModule,
    ExtraJobRequestModule
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
