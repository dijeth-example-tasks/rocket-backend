import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CheckSizePipe implements PipeTransform<string, string> {
  constructor(private readonly size: number) {}

  transform(value: string): string {
    if (value && value.length < this.size) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
