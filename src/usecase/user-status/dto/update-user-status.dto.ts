import { PartialType } from '@nestjs/mapped-types';
import { CreateUserStatusDto } from './create-user-status.dto';

export class UpdateUserStatusDto extends PartialType(CreateUserStatusDto) {}
