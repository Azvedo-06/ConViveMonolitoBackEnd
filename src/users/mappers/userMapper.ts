import { UserResponseDto } from "../dto/userResponse.dto";
import { User } from "../entity/user.model";
export function toUserResponse(user: User): UserResponseDto {
  return {
    id: user.id.toString(),
    name: user.name,
    cpf: user.cpf,
    phone: user.phone,
    email: user.email,
    role: user.role,
    linkedin: user.linkedin,
    instagram: user.instagram,
    youtube: user.youtube,
    cnpj: user.cnpj,
    cep: user.cep,
    createdAt: user.createdAt,
  };
}
