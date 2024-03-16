import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { GetUsersBodyDto } from '../dto/get-uses-body.dto';

@Injectable()
export class UsersBodyValidation implements PipeTransform {
  transform(value: any): GetUsersBodyDto {
    if (typeof value !== 'object') {
      throw new BadRequestException('Payload must be an object');
    }

    if (!value.ids) {
      throw new BadRequestException('Payload must has a key named "ids"');
    }

    if (!Array.isArray(value.ids)) {
      throw new BadRequestException(
        'The "ids" field of payload must be an array of numbers',
      );
    }

    const ids = value.ids.map((it) => Number(it)).filter(Boolean);
    return new GetUsersBodyDto(ids);
  }
}
