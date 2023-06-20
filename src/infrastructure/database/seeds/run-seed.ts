import { NestFactory } from "@nestjs/core";
import { SeedModule } from "./seed.module";
import { UserSeedService } from "./user/user-seed.service";
import { RoleSeedService } from "./role/role-seed.service";
import { UserStatusSeedService } from "./user-status/user-status-seed.service";

const runSeed = async () => {
    const app = await NestFactory.create(SeedModule);
    // run
    await app.get(UserSeedService).run();
    await app.get(RoleSeedService).run();
    await app.get(UserStatusSeedService).run();
    await app.close();
};

void runSeed();
