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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('headerImage'))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() headerImage: Express.Multer.File,
  ) {
    if (headerImage) {
      console.log('Image received:', headerImage.originalname);

      const imageUrl = await this.cloudinaryService.uploadImage(headerImage);
      createBlogDto.headerImage = imageUrl.secure_url;
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
