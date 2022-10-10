import { PickType, PartialType } from '@nestjs/swagger';
import { Message } from '../entities/message.entity';

export class UpdateMessageDto extends PartialType(
  PickType(Message, ['attachments', 'content', 'embeds'] as const),
) {}
