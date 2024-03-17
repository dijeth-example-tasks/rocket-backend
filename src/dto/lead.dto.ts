import { RawLead } from '../types';

export class LeadDto {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly responsibleUserId: number;
  readonly statusId: number;
  readonly pipelineId: number;
  readonly createdAt: number;

  constructor(rawLead: RawLead) {
    this.id = rawLead.id;
    this.name = rawLead.name;
    this.price = rawLead.price;
    this.responsibleUserId = rawLead.responsible_user_id;
    this.statusId = rawLead.status_id;
    this.pipelineId = rawLead.pipeline_id;
    this.createdAt = rawLead.created_at;
  }
}
