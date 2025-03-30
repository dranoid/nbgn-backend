import { Blog } from './entities/blog.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), CloudinaryModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
