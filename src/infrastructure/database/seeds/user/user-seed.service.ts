import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../../entities/user.entity";
import { RoleEnum } from "../../../../domain/utils/enums/role.enum";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where : {
        role : RoleEnum.ADMIN
      }
    })

    if (countAdmin === 0) {
      await this.repository.save(
        this.repository.create({
          first_name: 'Super',
          last_name: 'Admin',
          email: 'admin@example.com',
          password: 'secret',
          role: RoleEnum.ADMIN,
        }),
      );
    }
  }
}
