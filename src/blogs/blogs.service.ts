import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from 'nestjs-paginate';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    return await this.blogsRepository.save(createBlogDto);
    //
  }

  async findAll(query: PaginateQuery) {
    const filterOperations = [
      FilterOperator.BTW,
      FilterOperator.GT,
      FilterOperator.GTE,
      FilterOperator.LTE,
      FilterOperator.LT,
      FilterOperator.EQ,
    ];
    const paginateOptions: PaginateConfig<Blog> = {
      sortableColumns: ['createdAt', 'title', 'author'],
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['title', 'author', 'id', 'description', 'tags'],
      filterableColumns: {
        tags: filterOperations,
        author: filterOperations,
        title: filterOperations,
      },
    };

    return paginate(query, this.blogsRepository, paginateOptions);
  }

  async findOne(id: string) {
    return await this.blogsRepository.findOne({ where: { id } });
  }

  // async update(id: string, updateData: UpdateBlogDto) {
  //   // Find the existing blog post
  //   const blogPost = await this.blogsRepository.findOne({ where: { id } });
  //   if (!blogPost) {
  //     throw new NotFoundException(`Blog post with id ${id} not found`);
  //   }

  //   let updateBlogDto: UpdateBlogDto;

  //   // Handle FormData
  //   if (updateData instanceof FormData) {
  //     const headerImageFile = updateData.get('headerImage') as Express.Multer.File;

  //     // If there's a new header image, upload it
  //     let headerImageUrl = blogPost.headerImage; // Keep existing by default
  //     if (headerImageFile) {
  //       const uploadResult =
  //         await this.cloudinaryService.uploadImage(headerImageFile);
  //       headerImageUrl = uploadResult.secure_url;

  //       // Delete old header image if it exists
  //       if (blogPost.headerImage) {
  //         const publicId = getPublicIdFromUrl(blogPost.headerImage);
  //         await this.cloudinaryService.deleteImage(publicId);
  //       }
  //     }

  //     // Convert FormData to DTO
  //     updateBlogDto = {
  //       title: (updateData.get('title') as string) || blogPost.title,
  //       author: (updateData.get('author') as string) || blogPost.author,
  //       description:
  //         (updateData.get('description') as string) || blogPost.description,
  //       body: (updateData.get('body') as string) || blogPost.body,
  //       tags:
  //         Array.from(updateData.getAll('tags[]') as string[]) || blogPost.tags,
  //       headerImage: headerImageUrl,
  //       // Handle images array if present
  //       images:
  //         Array.from(updateData.getAll('images[]') as string[]) ||
  //         blogPost.images,
  //     };
  //   } else {
  //     // Handle regular UpdateBlogDto
  //     updateBlogDto = updateData;

  //     // If new header image URL is provided, delete the old one
  //     if (
  //       updateBlogDto.headerImage &&
  //       updateBlogDto.headerImage !== blogPost.headerImage
  //     ) {
  //       await this.uploadService.deleteFile(blogPost.headerImage);
  //     }
  //   }

  //   // Handle image array updates if the body has changed
  //   if (updateBlogDto.body !== blogPost.body) {
  //     // If new images array is provided, clean up old images that are no longer used
  //     if (updateBlogDto.images) {
  //       const oldImages = blogPost.images || [];
  //       const newImages = updateBlogDto.images;

  //       // Find images that are no longer used
  //       const removedImages = oldImages.filter(
  //         (img) => !newImages.includes(img),
  //       );

  //       // Delete removed images
  //       for (const imageUrl of removedImages) {
  //         try {
  //           await this.uploadService.deleteFile(imageUrl);
  //         } catch (error) {
  //           console.error(`Failed to delete image: ${imageUrl}`, error);
  //         }
  //       }
  //     }
  //   }

  //   // Merge and save the updates
  //   const updatedBlogPost = this.blogsRepository.merge(blogPost, updateBlogDto);
  //   return this.blogsRepository.save(updatedBlogPost);
  // }

  async update(
    id: string,
    payload: UpdateBlogDto & { headerImage?: Express.Multer.File },
  ) {
    // Find the existing blog post
    const blogPost = await this.blogsRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }

    console.log('payload header image', payload.headerImage);
    // Handle header image upload if present
    if (payload.headerImage && payload.headerImage !== blogPost.headerImage) {
      // Upload new header image
      const uploadResult = await this.cloudinaryService.uploadImage(
        payload.headerImage,
      );

      // Delete old header image if it exists
      if (blogPost.headerImage) {
        const publicId = this.getPublicIdFromUrl(blogPost.headerImage);
        await this.cloudinaryService.deleteImage(publicId);
      }

      // Update the payload with the new image URL
      payload.headerImage = uploadResult.secure_url;
    }

    // Handle image cleanup if body content has changed
    if (payload.body && payload.body !== blogPost.body && payload.images) {
      const oldImages = blogPost.images || [];
      const newImages = payload.images;

      // Find and delete unused images
      const removedImages = oldImages.filter((img) => !newImages.includes(img));
      await Promise.all(
        removedImages.map(async (imageUrl) => {
          try {
            const publicId = this.getPublicIdFromUrl(imageUrl);
            await this.cloudinaryService.deleteImage(publicId);
          } catch (error) {
            console.error(`Failed to delete image: ${imageUrl}`, error);
          }
        }),
      );
    }

    // If a new headerImage URL is provided directly (not as a file)
    if (
      payload.headerImage &&
      typeof payload.headerImage === 'string' &&
      payload.headerImage !== blogPost.headerImage &&
      blogPost.headerImage
    ) {
      const publicId = this.getPublicIdFromUrl(blogPost.headerImage);
      await this.cloudinaryService.deleteImage(publicId);
    }

    // Remove the file object before updating DB
    const updateData = { ...payload };
    if (updateData.headerImage instanceof File) {
      delete updateData.headerImage;
    }

    // Merge and save the updates
    const updatedBlogPost = this.blogsRepository.merge(blogPost, updateData);
    return this.blogsRepository.save(updatedBlogPost);
  }

  async remove(id: string) {
    return this.blogsRepository.delete(id);
  }

  getPublicIdFromUrl(url: string): string {
    try {
      const matches = url.match(/\/v\d+\/(.+?)\./);
      return matches ? matches[1] : '';
    } catch (error) {
      console.error('Error extracting public ID from URL:', error);
      return '';
    }
  }
}
