import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  Validate
} from 'class-validator';
import { CpfValidator } from '../utility/cpf.validator';
import { CnpjValidator } from '../utility/cnpj.validator';
import { Role } from '../../auth/enums/role.enum';
export class CreateUserDto {
  @IsString()
  name!: string;

  @IsOptional()
  @Validate(CpfValidator)
  cpf?: string;

  @IsOptional()
  @Validate(CnpjValidator)
  cnpj?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'O CEP deve conter 8 dígitos numéricos.' })
  cep?: string;

  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'O telefone deve conter 10 ou 11 dígitos numéricos (apenas números, incluindo o DDD).' })
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
  })
  password!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}