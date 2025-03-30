import { CloudinaryProvider } from './cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
