import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.cloudinaryService.uploadImage(file);
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to upload image', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('delete-image')
  async deleteImage(@Body() body: { public_id: string }) {
    const { public_id } = body;
    try {
      const result = await this.cloudinaryService.deleteImage(public_id);
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to delete image', HttpStatus.BAD_REQUEST);
    }
  }
}
