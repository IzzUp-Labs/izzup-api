import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExtraEntity } from "../entities/extra.entity";
import { ExtraController } from "../../application/extra/extra.contoller";
import { ExtraService } from "../../domain/services/extra/extra.service";

@Module({
  imports: [TypeOrmModule.forFeature([ExtraEntity])],
  controllers: [ExtraController],
  providers: [ExtraService],
  exports: [ExtraService]
})
export class ExtraModule {
}
