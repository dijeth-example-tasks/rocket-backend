import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class GetLastItem<T = any> implements PipeTransform<T | T[], T> {
  transform(value: T | T[]): T {
    if (!Array.isArray(value)) {
      return value;
    }

    if (!value.length) {
      throw new BadRequestException('Validation failed');
    }

    return value.at(-1);
  }
}
