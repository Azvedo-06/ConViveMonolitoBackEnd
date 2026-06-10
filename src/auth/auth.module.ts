import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entity/user.model';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory:(configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRATION'),
      }
    }),
  }),
  ],
})
export class AuthModule {}