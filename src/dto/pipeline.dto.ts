import { RawPipeline } from 'src/types';
import { StatusDto } from './status.dto';

export class PipelineDto {
  readonly id: number;
  readonly name: string;
  statuses: StatusDto[];

  constructor(rawData: RawPipeline) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.statuses = rawData._embedded.statuses.map((it) => new StatusDto(it));
  }
}
