import { PartialType } from '@nestjs/swagger';
import { CreateGooglePlaceDto } from './create-google-place.dto';

export class UpdateGooglePlaceDto extends PartialType(CreateGooglePlaceDto) {}
