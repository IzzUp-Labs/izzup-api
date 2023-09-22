import {Controller} from '@nestjs/common';
import { DeviceService } from './device.service';
import {ApiTags} from "@nestjs/swagger";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";

@ApiTags("Device")
@Controller({
  path: "device",
  version: "1"
})
export class DeviceController {
  constructor() {}
}
