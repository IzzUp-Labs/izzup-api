import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivitySectorEntity } from "./entities/activity-sector.entity";
import { ActivitySectorController } from "./activity-sector.controller";
import { ActivitySectorService } from "./activity-sector.service";

@Module({
  imports: [TypeOrmModule.forFeature([ActivitySectorEntity])],
  controllers: [ActivitySectorController],
  providers: [ActivitySectorService],
  exports: [ActivitySectorService]
})
export class ActivitySectorModule {

}