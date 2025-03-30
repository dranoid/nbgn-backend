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

  async update(id: string, payload: UpdateBlogDto) {
    const blogPost = await this.blogsRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }

    // Handle image updates and deletions
    if (blogPost.headerImage) {
      // Check if current image is in deletedImages array
      if (payload.deletedImages?.includes(blogPost.headerImage)) {
        // If we have a new image URL, use it
        if (payload.headerImage) {
          blogPost.headerImage = payload.headerImage;
        } else {
          // If no new image, set to null
          blogPost.headerImage = null;
        }
      } else if (payload.headerImage) {
        // If we have a new image but current image wasn't marked for deletion
        // Add current image to deletedImages array so it gets cleaned up
        if (!payload.deletedImages) {
          payload.deletedImages = [];
        }
        payload.deletedImages.push(blogPost.headerImage);
        blogPost.headerImage = payload.headerImage;
      }
    } else if (payload.headerImage) {
      // No existing image but we have a new one
      blogPost.headerImage = payload.headerImage;
    }

    // Handle deletion of all images in deletedImages array
    if (payload.deletedImages?.length > 0) {
      for (const imageUrl of payload.deletedImages) {
        try {
          const publicId = this.getPublicIdFromUrl(imageUrl);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.error(`Failed to delete image: ${imageUrl}`, error);
        }
      }
    }

    // Remove the deletedImages from the payload as it's not a database field
    delete payload.deletedImages;

    const updatedBlogPost = this.blogsRepository.merge(blogPost, payload);
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
