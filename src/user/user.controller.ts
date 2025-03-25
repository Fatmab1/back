import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { UserRole } from './user.entity';
import { Request } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)  
  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return await this.usersService.create(userData);
  }

 

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | null> {
    return await this.usersService.findOne(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateData: Partial<User>): Promise<User | null> {

    return await this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.usersService.delete(id);
  }
}
