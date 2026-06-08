import { Body, Controller, Get, Post, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { toUserResponse } from './mappers/userMapper';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        return toUserResponse(user); // Mapear o usuário criado para UserResponseDto
    }

    @Get('me')
    async getMe(@Req() req) {
        const user = await this.usersService.findById(req.user.userId);
        return toUserResponse(user); // Mapear o usuário para UserResponseDto
    } 

    @Patch('me')
    async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
        const user = await this.usersService.update(req.user.userId, dto);
        return toUserResponse(user);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN) // Apenas administradores podem acessar este endpoint
    async getAllUsers() {
        const users = await this.usersService.findAll();
        return users.map(toUserResponse); // Mapear cada usuário para UserResponseDto .map é uma função de array do JavaScript que aplica a função toUserResponse a cada elemento do array users
    }
}