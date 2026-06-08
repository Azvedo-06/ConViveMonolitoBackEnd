import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateIf,
  IsPositive,
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

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  city!: string;

  @ValidateIf((o) => o.type === 'PRIVATE')
  @IsNumber()
  @IsPositive()
  price?: number;

  @ValidateIf((o) => o.type === 'PRIVATE')
  @IsNumber()
  @IsPositive()
  maxParticipants?: number;
}