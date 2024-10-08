import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/auth/dto/roles.enum';
import { RolesGuard } from 'src/auth/auth.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      console.log('Image received:', image.originalname);
    } else {
      console.log('No image received');
    }
    return this.blogsService.create(createBlogDto);
  }

  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.blogsService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
