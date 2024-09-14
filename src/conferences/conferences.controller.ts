import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConferencesService } from './conferences.service';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/auth/dto/roles.enum';
import { RolesGuard } from 'src/auth/auth.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('conferences')
export class ConferencesController {
  constructor(private readonly conferencesService: ConferencesService) {}

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createConferenceDto: CreateConferenceDto) {
    return this.conferencesService.create(createConferenceDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.conferencesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conferencesService.findOne(id);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConferenceDto: UpdateConferenceDto,
  ) {
    return this.conferencesService.update(id, updateConferenceDto);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conferencesService.remove(id);
  }
}
