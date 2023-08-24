import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "./entities/tag.entity";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {
}
