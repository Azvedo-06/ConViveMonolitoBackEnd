import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';

import { EventType } from '../enums/event-type.enum';

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  location!: string;

  @IsDateString()
  date!: Date;

  @IsEnum(EventType)
  type!: EventType;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  maxParticipants?: number;
}