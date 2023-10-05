import {Injectable} from '@nestjs/common';
import {DeviceEntity} from "./entities/device.entity";
import {EntityCondition} from "../../domain/utils/types/entity-condition.type";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UpdateDeviceDto} from "./dto/update-device.dto";
import {CreateDeviceDto} from "./dto/create-device.dto";

@Injectable()
export class DeviceService {

  constructor(
      @InjectRepository(DeviceEntity)
      private deviceRepository: Repository<DeviceEntity>,
  ) {}

  async findOne(fields: EntityCondition<DeviceEntity>) {
    return this.deviceRepository.findOne({
      relations: ["user"],
      where: fields
    });
  }

  async update(deviceId: string, updateDeviceDto: UpdateDeviceDto){
    return this.deviceRepository.update(deviceId, updateDeviceDto);
  }

  async create(createDeviceDto: CreateDeviceDto){
    return this.deviceRepository.save(createDeviceDto);
  }

  async getDevicesInformation(userId: string) {
    const devices = await this.deviceRepository.createQueryBuilder("device")
        .leftJoinAndSelect("device.user", "user")
        .where("user.id = :user", {user: userId})
        .getMany();
    return devices.map(device => {
        return {
            token: device.fcm_token,
            language: device.device_language
        }
    });
  }

  async getAllUserDevices(userId: string) {
    return this.deviceRepository.find({
      where: {
        user: {
          id: userId
        }
      }
    });
  }

  async remove(deviceId: string) {
    return this.deviceRepository.delete(deviceId);
  }

  async removeUserDevices(userId: string) {
    return this.deviceRepository.delete({
        user: {
            id: userId
        }
    });
  }
}
