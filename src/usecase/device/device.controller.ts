import {Controller} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";

@ApiTags("Device")
@Controller({
  path: "device",
  version: "1"
})
export class DeviceController {}
