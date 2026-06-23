import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcrypt';
import { User } from '../users/entity/user.model';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const passwordMatch = await Bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
