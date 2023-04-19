import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "../entities/tag.entity";
import { TagService } from "../../domain/services/tag/tag.service";
import { TagController } from "../../application/tag/tag.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}