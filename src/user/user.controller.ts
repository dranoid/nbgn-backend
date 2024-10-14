import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/auth/dto/roles.enum';
import { RolesGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('me')
  getProfileData(@Req() request: Request) {
    const userId = request['user'].userId;
    return this.userService.getUserProfile(userId);
  }
}
