import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageFallbackUrl?: string;

  @IsOptional()
  @IsString()
  colorPrimary?: string;

  @IsOptional()
  @IsString()
  colorSecondary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  spotlight?: string;
}
