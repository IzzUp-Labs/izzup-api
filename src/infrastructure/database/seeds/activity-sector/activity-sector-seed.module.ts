import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ActivitySectorEntity} from "../../../../usecase/activity-sector/entities/activity-sector.entity";
import {ActivitySectorSeedService} from "./activity-sector-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([ActivitySectorEntity])],
    providers: [ActivitySectorSeedService],
    exports: [ActivitySectorSeedService],
})
export class ActivitySectorSeedModule {}