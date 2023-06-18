import { Module } from "@nestjs/common";
import databaseConfig from "./infrastructure/config/database.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./infrastructure/config/app.config";
import { TypeOrmConfigService } from "./infrastructure/config/typeorm-config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./usecase/user/user.module";
import { AuthModule } from "./usecase/auth/auth.module";
import authConfig from "./infrastructure/config/auth.config";
import { ExtraModule } from "./usecase/extra/extra.module";
import { RoleModule } from "./usecase/role/role.module";
import { RolesGuard } from "./domain/guards/role.guard";
import { EmployerModule } from "./usecase/employer/employer.module";
import { CompanyModule } from "./usecase/company/company.module";
import { ActivitySectorModule } from "./usecase/activity-sector/activity-sector.module";
import { TagModule } from "./usecase/tag/tag.module";
import { JobOfferModule } from "./usecase/job-offer/job-offer.module";
import { JobStatusModule } from "./usecase/job-status/job-status.module";
import { ExtraJobRequestModule } from "./usecase/extra/extra-job-request.module";
import { HomepageCardModule } from "./usecase/homepage-card/homepage-card.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        authConfig
      ],
      envFilePath: [".env"]
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
    ExtraJobRequestModule,
    HomepageCardModule
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
