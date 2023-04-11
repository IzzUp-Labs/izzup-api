import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../application/user/dto/create-user.dto';
import { UpdateUserDto } from '../../../application/user/dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../infrastructure/entities/user.entity';
import { EntityCondition } from '../../utils/types/entity-condition.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {
  }

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(fields: EntityCondition<UserEntity>) {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...updateUserDto,
      }),
    );
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
