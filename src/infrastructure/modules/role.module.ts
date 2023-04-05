import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "../entities/role.entity";
import { RoleController } from "../../application/role/role.controller";
import { RoleService } from "../../domain/services/role/role.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
