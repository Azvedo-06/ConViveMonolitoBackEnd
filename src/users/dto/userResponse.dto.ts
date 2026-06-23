import { Role } from '../../auth/enums/role.enum';
export class UserResponseDto {
  id!: string;
  name!: string;
  cpf?: string;
  phone!: string;
  email!: string;
  role!: Role;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  cnpj?: string;
  cep?: string;
  createdAt!: Date;
}
