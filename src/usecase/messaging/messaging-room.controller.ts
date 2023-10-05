import { Controller, Delete, Get, Headers, Param, Post, UseGuards } from "@nestjs/common";
import { MessagingRoomService } from "./messaging-room.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ParamCheckService } from "../../domain/middleware/param-check/param-check.service";

@ApiTags("Messaging Room")
@Controller({
  path: "messaging-room",
  version: "1"
})
export class MessagingRoomController {
  constructor(private readonly messagingRoomService: MessagingRoomService,
              private readonly paramCheckService: ParamCheckService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("create/:participantId")
  create(@Headers("Authorization") authorization: string, @Param("participantId") participantId: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.messagingRoomService.create(userId, participantId);
  }

  @Get()
  findAll() {
    return this.messagingRoomService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.messagingRoomService.findOne({ id: id });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.messagingRoomService.remove(id);
  }
}
