import { RawUser } from '../types';

export class UserDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;

  constructor(rawData: RawUser) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.email = rawData.email;
  }
}
