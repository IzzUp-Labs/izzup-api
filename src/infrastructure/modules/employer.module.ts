import { Module } from "@nestjs/common";
import { EmployerEntity } from "../entities/employer.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployerController } from "../../application/employer/employer.controller";
import { EmployerService } from "../../domain/services/employer/employer.service";

@Module({
  imports: [TypeOrmModule.forFeature([EmployerEntity])],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService]
})
export class EmployerModule {
}