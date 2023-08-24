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
import { FileExtensionChecker } from "../../domain/utils/file-extension-checker/file-extension-checker";
import { SocketService } from "../app-socket/socket.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly userStatusService: UserStatusService,
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
    private readonly socketService: SocketService,
    private readonly configService: ConfigService,
    private readonly fileExtensionChecker: FileExtensionChecker
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
      relations: ["statuses"],
      where: fields
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...updateUserDto
      })
    );
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }

  async addStatus(id: string, status: UserStatusEnum) {
    const selectedStatus = await this.userStatusService.findOne({
      name: status
    });
    try {
      return this.usersRepository.createQueryBuilder()
        .relation(UserEntity, "statuses")
        .of(id)
        .add(selectedStatus.id);
    } catch (e) {
      console.log(e);
    }
  }

  async removeStatus(id: string, status: UserStatusEnum) {
    const selectedStatus = await this.userStatusService.findOne({
      name: status
    });
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

  async verifyUser(id: string) {
    const unverifiedStatus = await this.userStatusService.findOne({
      name: UserStatusEnum.UNVERIFIED
    });
    const verifiedStatus = await this.userStatusService.findOne({
      name: UserStatusEnum.VERIFIED
    });
    //SOCKET : EMIT EVENT "JOB-REQUEST-ACCEPTED"
    const clientId = await this.socketService.findClientByUserId(id);
    this.socketService.socket.to(clientId).emit("account_verified", {
      message: "Your account has been verified"
    });
    await this.usersRepository.createQueryBuilder("user")
      .relation(UserEntity, "statuses")
      .of(id)
      .addAndRemove([verifiedStatus.id], [unverifiedStatus.id]);

    return await this.deleteIdPhoto(id);
  }

  async uploadFile(userId: string, file: Express.Multer.File) {
    const fileExtension = file.originalname.split(".").pop();
    if (!this.fileExtensionChecker.check(fileExtension)) {
      throw new HttpException("Invalid file extension", 400);
    }
    const bucket = this.firebase.storage.bucket(this.configService.get("firebase.storage_name"))
      .file(this.configService.get("firebase.image_bucket_name") + userId + "." + fileExtension);

    const blobStream = bucket.createWriteStream({
      resumable: false
    });
    blobStream.on("error", () => {
      return new HttpException("Something went wrong with the upload", 500);
    });
    blobStream.on("finish", () => {
      bucket.getSignedUrl({
        action: "read",
        expires: "03-09-2491"
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

  async uploadId(userId: string, file: Express.Multer.File) {
    const fileExtension = file.originalname.split(".").pop();
    if (!this.fileExtensionChecker.check(fileExtension)) {
      throw new HttpException("Invalid file extension", 400);
    }
    const bucket = this.firebase.storage.bucket(this.configService.get("firebase.storage_name"))
      .file(this.configService.get("firebase.id_bucket_name") + userId + "." + fileExtension);

    const blobStream = bucket.createWriteStream({
      resumable: false
    });
    blobStream.on("error", () => {
      return new HttpException("Something went wrong with the upload", 500);
    });
    blobStream.on("finish", () => {
      bucket.getSignedUrl({
        action: "read",
        expires: "03-09-2491"
      }).then(signedUrls => {
        this.usersRepository.createQueryBuilder()
          .where("id = :id", { id: userId })
          .update(UserEntity)
          .set({ id_photo: signedUrls[0] })
          .execute();
      });
    });
    blobStream.end(file.buffer);
  }

  async deleteIdPhoto(userId: string) {
    await this.firebase.storage.bucket(this.configService.get("firebase.storage_name"))
      .deleteFiles({
        prefix: this.configService.get("firebase.id_bucket_name") + userId
      })
      .then(() => {
        this.usersRepository.createQueryBuilder()
          .where("id = :id", { id: userId })
          .update(UserEntity)
          .set({ id_photo: null })
          .execute();
      });
  }
}
