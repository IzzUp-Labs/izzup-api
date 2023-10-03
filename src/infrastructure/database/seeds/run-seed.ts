import { NestFactory } from "@nestjs/core";
import { SeedModule } from "./seed.module";
import { UserSeedService } from "./user/user-seed.service";
import { RoleSeedService } from "./role/role-seed.service";
import { UserStatusSeedService } from "./user-status/user-status-seed.service";
import { ActivitySectorSeedService } from "./activity-sector/activity-sector-seed.service";
import { TagsSeedService } from "./tags/tags-seed.service";
import { HomepageCardSeedService } from "./homepage-card/homepage-card-seed.service";
import {BadgeSeedService} from "./badge/badge-seed.service";

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);
  // run
  await app.get(ActivitySectorSeedService).run();
  await app.get(RoleSeedService).run();
  await app.get(UserStatusSeedService).run();
  await app.get(TagsSeedService).run();
  await app.get(HomepageCardSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(BadgeSeedService).run();
  await app.close();
};

void runSeed();
