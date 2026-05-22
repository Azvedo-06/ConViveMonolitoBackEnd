import { IsEmail, IsString } from 'class-validator';
// DTO para login de usuário
// LoginDto define a estrutura dos dados necessários para autenticação
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}