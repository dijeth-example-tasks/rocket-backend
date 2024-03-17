import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class GetLastItem<T = any> implements PipeTransform<T | T[], T> {
  transform(value: T | T[]): T {
    if (!Array.isArray(value)) {
      return value;
    }

    if (!value.length) {
      return undefined;
    }

    return value.at(-1);
  }
}
