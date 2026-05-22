import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Faze o módulo de configuração estar disponível globalmente
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadModels: true, // Carrega os modelos automaticamente
        synchronize: false, // SEMPRE false com migrations
      }),
    }),
    AuthModule,
    AdminModule,
    UsersModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD, // Aplica o guard globalmente
      useClass: JwtAuthGuard, // Usa o JwtAuthGuard para autenticação
    },
    AppService,
  ],
})
export class AppModule {}
