import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WebhookModule } from './webhook/webhook.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Notification } from './webhook/entities/notification.entity';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env',
    }),
    // Database connection with TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // SSL configuration for Supabase
        ssl:
          configService.get<string>('DB_SSL') === 'true'
            ? {
                rejectUnauthorized: false, // Required for Supabase
              }
            : false,
        // Entities configuration
        entities: [User, Notification], // Add your entities here
        // Auto-load entities from the entities directory
        autoLoadEntities: true,
        // Synchronize database schema (set to false in production!)
        synchronize: process.env.NODE_ENV !== 'production',
        // Connection pooling options
        extra: {
          max: 20, // Maximum number of connections in the pool
          connectionTimeoutMillis: 2000,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
