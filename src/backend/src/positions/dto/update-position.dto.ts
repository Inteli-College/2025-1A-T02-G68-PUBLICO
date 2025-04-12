import { PartialType } from '@nestjs/mapped-types';
import { BasePositionDto } from './create-position.dto';

export class UpdatePositionDto extends PartialType(BasePositionDto) {}
