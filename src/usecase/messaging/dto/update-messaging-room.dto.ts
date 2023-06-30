import { PartialType } from '@nestjs/mapped-types';
import { CreateMessagingRoomDto } from './create-messaging-room.dto';

export class UpdateMessagingRoomDto extends PartialType(CreateMessagingRoomDto) {}
