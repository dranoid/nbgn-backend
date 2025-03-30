import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    // const fiveMb = 5 * 1024 * 1024;
    console.log(value, 'value');
    console.log(value.size, 'value.size');
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
