import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { configService } from "./infrastructure/config/typeorm/config.service";

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  controllers: [],
  providers: [],
})
export class AppModule {}
