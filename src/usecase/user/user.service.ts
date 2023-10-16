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
import {DeviceService} from "../device/device.service";
import {CreateDeviceDto} from "../device/dto/create-device.dto";
import {NotificationService} from "../notification/notification.service";
import {CheckDeviceFcmTokenDto} from "../device/dto/check-device-fcm-token.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly userStatusService: UserStatusService,
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
    private readonly configService: ConfigService,
    private readonly fileExtensionChecker: FileExtensionChecker,
    private readonly deviceService: DeviceService,
    private readonly notificationService: NotificationService,
  ) {
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(
      this.userRepository.create(createUserDto)
    );
  }

  findAll() {
    return this.userRepository.find({
      relations: ["employer", "extra", "statuses"]
    });
  }

  findAllUserWithRating() {
    return this.userRepository.find({
      relations: ["employer", "extra", "statuses", "ratings"]
    });
  }

  findOne(fields: EntityCondition<UserEntity>) {
    return this.userRepository.findOne({
      relations: ["statuses"],
      where: fields
    });
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(userId, updateUserDto);
  }

  async updateInfo(userId: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    await this.uploadId(userId, file);
    await this.removeStatus(userId, UserStatusEnum.NOT_VALID)
    return this.userRepository.update(userId, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async findUserStatuses(userId: string) {
    const userStatuses = await this.userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.statuses", "status")
      .where("user.id = :id", { id: userId })
      .getOne();
    return userStatuses.statuses;
  }

  async addStatus(userId: string, status: UserStatusEnum) {
    const selectedStatus = await this.userStatusService.findOne({
      name: status
    });
    const userStatuses = await this.findUserStatuses(userId);
    if (userStatuses.find(userStatus => userStatus.name === status)) {
      throw new HttpException("User already has this status", 400);
    }
    try {
      return this.userRepository.createQueryBuilder()
        .relation(UserEntity, "statuses")
        .of(userId)
        .add(selectedStatus.id);
    } catch (e) {
      console.log(e);
    }
  }

  async removeStatus(userId: string, status: UserStatusEnum) {
    const selectedStatus = await this.userStatusService.findOne({
      name: status
    });
    const userStatuses = await this.findUserStatuses(userId);
    if (!userStatuses.find(userStatus => userStatus.name === status)) {
        throw new HttpException("User does not have this status", 400);
    }
    try {
      return this.userRepository.createQueryBuilder()
        .relation(UserEntity, "statuses")
        .of(userId)
        .remove(selectedStatus.id);
    } catch (e) {
      console.log(e);
    }
  }

  async getUnverifiedUsers() {
    const users = await this.userRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.statuses", "status")
        .leftJoinAndSelect("user.employer", "employer")
        .leftJoinAndSelect("user.extra", "extra")
        .getMany()
    return users.filter(user => user.statuses.find(userStatus => userStatus.name === UserStatusEnum.UNVERIFIED) && !user.statuses.find(userStatus => userStatus.name === UserStatusEnum.NOT_VALID));
  }

  async verifyUser(userId: string) {
    const unverifiedStatus = await this.userStatusService.findOne({
      name: UserStatusEnum.UNVERIFIED
    });
    const verifiedStatus = await this.userStatusService.findOne({
      name: UserStatusEnum.VERIFIED
    });

    // NOTIFICATION : SEND NOTIFICATION TO USER (ACCOUNT-VERIFIED)
    await this.notificationService.sendBasicNotificationToUser(userId, "account-verified-body", {
      type: "account_verified",
    });

    await this.userRepository.createQueryBuilder("user")
      .relation(UserEntity, "statuses")
      .of(userId)
      .addAndRemove([verifiedStatus.id], [unverifiedStatus.id]);

    return await this.deleteIdPhoto(userId);
  }

  async notVerifyUser(userId: string) {
    // NOTIFICATION : SEND NOTIFICATION TO USER (ACCOUNT-NOT-VERIFIED)
    await this.notificationService.sendBasicNotificationToUser(userId, "account-not-verified-body", {
      type: "account_not_verified",
    });
    await this.addStatus(userId, UserStatusEnum.NOT_VALID)
    return await this.deleteIdPhoto(userId);
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
        this.userRepository.createQueryBuilder()
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
      }).then(async signedUrls => {
        await this.userRepository.createQueryBuilder()
          .where("id = :id", { id: userId })
          .update(UserEntity)
          .set({ id_photo: signedUrls[0] })
          .execute();
        const userStatuses = await this.findUserStatuses(userId);
        if (!userStatuses.find(userStatus => userStatus.name === UserStatusEnum.UNVERIFIED)) {
          await this.addStatus(userId, UserStatusEnum.UNVERIFIED)
        }
        if(userStatuses.find(userStatus => userStatus.name === UserStatusEnum.NEED_ID)) {
          await this.removeStatus(userId, UserStatusEnum.NEED_ID)
        }
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
        this.userRepository.createQueryBuilder()
          .where("id = :id", { id: userId })
          .update(UserEntity)
          .set({ id_photo: null })
          .execute();
      });
  }

  async checkFCMToken(userId: string, checkUserFcmTokenDto: CheckDeviceFcmTokenDto) {
    const user = await this.findOne({id: userId});
    const device = await this.deviceService.findOne({device_id: checkUserFcmTokenDto.device_id});
    if (device && device.user.id === user.id) {
      if (device.fcm_token !== checkUserFcmTokenDto.fcm_token) {
        device.fcm_token = checkUserFcmTokenDto.fcm_token;
        device.device_language = checkUserFcmTokenDto.device_language;
        device.notification_enabled = checkUserFcmTokenDto.notification_enabled;
        await this.deviceService.update(device.id, device);
      }
    }else{
      const device: CreateDeviceDto = {
        device_id: checkUserFcmTokenDto.device_id,
        fcm_token: checkUserFcmTokenDto.fcm_token,
        device_language: checkUserFcmTokenDto.device_language,
        notification_enabled: checkUserFcmTokenDto.notification_enabled,
        user: user
      }
      await this.deviceService.create(device);
    }
  }

  async deleteAccount(userId: string) {
    await this.deviceService.removeUserDevices(userId);
    await this.userRepository.delete(userId);
  }
}
