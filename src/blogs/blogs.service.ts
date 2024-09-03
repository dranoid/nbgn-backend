import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    return await this.blogsRepository.save(createBlogDto);
    //
  }

  async findAll() {
    return await this.blogsRepository.find();
  }

  async findOne(id: string) {
    return await this.blogsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const blogPost = await this.blogsRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }

    const updatedBlogPost = this.blogsRepository.merge(blogPost, updateBlogDto);

    this.blogsRepository.save(updatedBlogPost);
  }

  async remove(id: string) {
    return this.blogsRepository.delete(id);
  }
}
