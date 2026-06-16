import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/role.enum';
import { User } from './entity/user.model';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {} 
     
  async create(dto: CreateUserDto) {
    const existingCpf = await this.userModel.findOne({ where: { cpf: dto.cpf } });
    if (existingCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    const existingEmail = await this.userModel.findOne({ where: { email: dto.email } });
    if (existingEmail) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const existingPhone = await this.userModel.findOne({ where: { phone: dto.phone } });
    if (existingPhone) {
      throw new ConflictException('Telefone já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const userRole = dto.role && dto.role !== Role.ADMIN ? dto.role : Role.USER;

    return this.userModel.create({
      name: dto.name,
      cpf: dto.cpf,
      cnpj: dto.cnpj,
      cep: dto.cep,
      phone: dto.phone,
      email: dto.email,
      password: passwordHash,
      role: userRole,
    });
  }

  async findById(id: number): Promise<User> {
    if (!id) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }

  async findAll() {
    return await this.userModel.findAll();
  }

  async update(id: number, dto: any) {
    const user = await this.findById(id);
    
    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userModel.findOne({ where: { email: dto.email } });
      if (existingEmail) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existingPhone = await this.userModel.findOne({ where: { phone: dto.phone } });
      if (existingPhone) {
        throw new ConflictException('Telefone já cadastrado');
      }
    }

    const updateData: any = { ...dto };
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    await user.update(updateData);
    return user;
  }
}
