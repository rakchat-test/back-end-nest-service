import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Event type or name',
    example: 'user.created',
  })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({
    description: 'Payload data in JSON format',
    example: { userId: 123, name: 'John Doe' },
  })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>;
}
