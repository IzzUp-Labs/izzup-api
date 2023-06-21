import { HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";
import { UserStatusEnum } from "../../domain/utils/enums/user-status.enum";
import { UserStatusService } from "../user-status/user-status.service";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly userStatusService: UserStatusService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,

    private readonly configService: ConfigService
  ) {
  }

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(createUserDto)
    );
  }

  findAll() {
    return this.usersRepository.find({
      relations: ["employer", "extra", "statuses"]
    });
  }

  findOne(fields: EntityCondition<UserEntity>) {
    return this.usersRepository.findOne({
      where: fields
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...updateUserDto
      })
    );
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async addStatus(id: number, status: UserStatusEnum) {
    const selectedStatus = await this.userStatusService.findOne({
      name: status
    })
    try {
      return this.usersRepository.createQueryBuilder()
        .relation(UserEntity, "statuses")
        .of(id)
        .add(selectedStatus.id);
    } catch (e) {
      console.log(e);
    }
  }

  async removeStatus(id: number, status: UserStatusEnum) {
    const selectedStatus = await this.userStatusService.findOne({
      name: status
    })
    try {
      return this.usersRepository.createQueryBuilder()
        .relation(UserEntity, "statuses")
        .of(id)
        .remove(selectedStatus.id);
    } catch (e) {
      console.log(e);
    }
  }

  getUsersByStatus(status: UserStatusEnum) {
    return this.usersRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.statuses", "status")
      .where("status.name = :name", { name: status })
      .getMany();
  }

  async verifyUser(id: number) {
     const unverifiedStatus = await this.userStatusService.findOne({
      name: UserStatusEnum.UNVERIFIED
    })
     const verifiedStatus = await this.userStatusService.findOne({
      name: UserStatusEnum.VERIFIED
    })

    return this.usersRepository.createQueryBuilder("user")
      .relation(UserEntity, "statuses")
      .of(id)
      .addAndRemove([verifiedStatus.id], [unverifiedStatus.id])
  }

  async uploadFile(userId: number, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const bucket = this.firebase.storage.bucket(this.configService.get("firebase.storage_name"))
      .file(this.configService.get("firebase.image_bucket_name") + userId + "." + fileExtension);

    const blobStream = bucket.createWriteStream({
      resumable: false,
    });
    blobStream.on('error', () => {
      return new HttpException("Something went wrong with the upload", 500)
    });
    blobStream.on('finish', () => {
      bucket.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
      }).then(signedUrls => {
        this.usersRepository.createQueryBuilder()
          .where("id = :id", { id: userId })
          .update(UserEntity)
          .set({ photo: signedUrls[0] })
          .execute();
      });
    });
    blobStream.end(file.buffer);
  }
}
