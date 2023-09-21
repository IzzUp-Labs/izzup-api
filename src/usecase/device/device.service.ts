import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {DeviceEntity} from "./entities/device.entity";
import {EntityCondition} from "../../domain/utils/types/entity-condition.type";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class DeviceService {

  constructor(
      @InjectRepository(DeviceEntity)
      private deviceRepository: Repository<DeviceEntity>,
      private readonly userService: UserService,
  ) {}

  async findOne(fields: EntityCondition<DeviceEntity>) {
    return this.deviceRepository.findOne({
      where: fields
    });
  }

  async getFCMTokens(userId: string) {
    const user = await this.userService.findOne({id: userId});
    const devices = await this.deviceRepository.createQueryBuilder("device")
        .leftJoinAndSelect("device.user", "user")
        .where("user.id = :user", {user: user.id})
        .getMany();
    return devices.map(device => device.fcm_token);
  }

  async checkFCMToken(userId: string, deviceId: string, fcmToken: string) {
    const user = await this.userService.findOne({id: userId});
    const device = await this.findOne({device_id: deviceId});
    if (device) {
        if (device.fcm_token !== fcmToken) {
            device.fcm_token = fcmToken;
            await this.deviceRepository.save(device);
        }
    }else{
        await this.deviceRepository.save({
            device_id: deviceId,
            fcm_token: fcmToken,
            user: user
        });
    }
  }
}
