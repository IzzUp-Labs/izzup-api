import { PartialType } from '@nestjs/mapped-types';
import { CreateMessagingDto } from './create-messaging.dto';

export class UpdateMessagingDto extends PartialType(CreateMessagingDto) {
  id: number;
}
