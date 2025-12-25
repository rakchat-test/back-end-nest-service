import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Receive webhook and save notification' })
  @ApiHeader({
    name: 'x-secret',
    description: 'Webhook secret for authentication',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: Notification,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async handleWebhook(
    @Headers('x-secret') secret: string,
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    // Verify secret
    const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET');
    if (!webhookSecret || secret !== webhookSecret) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    // Save notification
    return await this.notificationService.create(createNotificationDto);
  }
}
