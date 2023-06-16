import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyEntity } from "./entities/company.entity";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService]
})
export class CompanyModule {
}