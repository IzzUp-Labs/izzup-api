import { Injectable } from "@nestjs/common";
import { CreateUserStatusDto } from "./dto/create-user-status.dto";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserStatusEntity } from "./entities/user-status.entity";
import { Repository } from "typeorm";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(UserStatusEntity)
    private userStatusRepository: Repository<UserStatusEntity>
  ) {
  }

  create(createUserStatusDto: CreateUserStatusDto) {
    return this.userStatusRepository.save(
      this.userStatusRepository.create(createUserStatusDto)
    );
  }

  findAll() {
    return this.userStatusRepository.find();
  }

  findOne(fields: EntityCondition<UserStatusEntity>) {
    return this.userStatusRepository.findOne({
      where: fields
    });
  }

  update(id: string, updateUserStatusDto: UpdateUserStatusDto) {
    return this.userStatusRepository.save(
      this.userStatusRepository.create({
        id,
        ...updateUserStatusDto
      })
    );
  }

  remove(id: string) {
    return this.userStatusRepository.delete(id);
  }
}
