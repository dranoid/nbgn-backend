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
  ParseFilePipe,
  MaxFileSizeValidator,
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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
        fileIsRequired: false, // Make file optional
      }),
    )
    headerImage: Express.Multer.File,
  ) {
    if (headerImage) {
      const imageUrl = await this.cloudinaryService.uploadImage(headerImage);
      createBlogDto.headerImage = imageUrl.secure_url;
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
  @UseInterceptors(FileInterceptor('headerImage'))
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
        fileIsRequired: false, // Make file optional
      }),
    )
    headerImage?: Express.Multer.File,
  ) {
    let payload = updateBlogDto;

    // If we received multipart form data, parse the string arrays
    if (headerImage || updateBlogDto instanceof FormData) {
      payload = {
        ...updateBlogDto,
        tags:
          typeof updateBlogDto.tags === 'string'
            ? JSON.parse(updateBlogDto.tags)
            : updateBlogDto.tags,
        images:
          typeof updateBlogDto.images === 'string'
            ? JSON.parse(updateBlogDto.images)
            : updateBlogDto.images,
      };
    }

    // Add the header image if present
    if (headerImage) {
      payload.headerImage = headerImage;
    }

    console.log(payload, 'payload');

    return this.blogsService.update(id, payload);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
