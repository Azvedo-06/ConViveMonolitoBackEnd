import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { CnpjValidator } from '../utility/cnpj.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Validate(CnpjValidator)
  cnpj?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'O CEP deve conter 8 dígitos numéricos.' })
  cep?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'O telefone deve conter 10 ou 11 dígitos numéricos (apenas números, incluindo o DDD).' })
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
  })
  password?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  youtube?: string;
}
