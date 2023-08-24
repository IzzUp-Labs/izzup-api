import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "../../../../usecase/role/entities/role.entity";
import { RoleSeedService } from "./role-seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleSeedService],
  exports: [RoleSeedService]
})
export class RoleSeedModule {
}
