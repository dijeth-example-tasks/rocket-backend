import { RawLead } from '../types';
import { LeadDto } from './lead.dto';
import { UserDto } from './user.dto';

export class LeadWithUserDto extends LeadDto {
  readonly user: UserDto;

  constructor(lead: RawLead | LeadDto, user: UserDto) {
    let rawLead: RawLead;
    if (lead instanceof LeadDto) {
      rawLead = {
        id: lead.id,
        name: lead.name,
        price: lead.price,
        responsible_user_id: lead.responsibleUserId,
        status_id: lead.statusId,
        pipeline_id: lead.pipelineId,
        created_at: lead.createdAt,
      };
    } else {
      rawLead = lead;
    }
    super(rawLead);
    this.user = user;
  }
}
