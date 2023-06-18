import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../../../usecase/user/entities/user.entity";
import { RoleEnum } from "../../../../domain/utils/enums/role.enum";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private configService: ConfigService
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where : {
        role : RoleEnum.ADMIN
      }
    })

    if (countAdmin === 0) {
      const hashedPassword = await bcrypt.hash(this.configService.get("seed-user.seed_admin_password"), 10);
      await this.repository.save(
        this.repository.create({
          first_name: this.configService.get("seed-user.seed_admin_firstname"),
          last_name: this.configService.get("seed-user.seed_admin_lastname"),
          email: this.configService.get("seed-user.seed_admin_email"),
          password: hashedPassword,
          role: RoleEnum.ADMIN,
        }),
      );
    }
  }
}
