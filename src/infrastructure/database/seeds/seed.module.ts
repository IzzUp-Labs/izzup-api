import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "../../config/app.config";
import databaseConfig from "../../config/database.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "../../config/typeorm-config.service";
import { UserSeedModule } from "./user/user-seed.module";
import { RoleSeedModule } from "./role/role-seed.module";

@Module({
  imports: [
    UserSeedModule,
    RoleSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService]
    }),
  ],
})
export class SeedModule {}
