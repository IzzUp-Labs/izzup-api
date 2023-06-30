import {Controller, Get, Post, Param, Delete, UseGuards, Headers} from '@nestjs/common';
import { MessagingRoomService } from './messaging-room.service';
import {ApiBearerAuth} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";

@Controller('messaging-room')
export class MessagingRoomController {
  constructor(private readonly messagingRoomService: MessagingRoomService,
              private readonly paramCheckService: ParamCheckService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create/:id')
  create(@Headers("Authorization") authorization: string, @Param('id') participantId: number) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.messagingRoomService.create(userId, participantId);
  }

  @Get()
  findAll() {
    return this.messagingRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagingRoomService.findOne({ id: id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagingRoomService.remove(id);
  }
}
