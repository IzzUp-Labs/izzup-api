import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import {ParamCheckModule} from "../../domain/middleware/param-check/param-check.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DeviceEntity} from "./entities/device.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]), ParamCheckModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {}
