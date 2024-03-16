import { RawStatus } from 'src/types';

export class StatusDto {
  readonly id: number;
  readonly name: string;

  constructor(rawData: RawStatus) {
    this.id = rawData.id;
    this.name = rawData.name;
  }
}
