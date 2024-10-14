import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, OnModuleInit } from '@nestjs/common';

import { AppController } from './app.controller';
import AppDataSource from '../typeorm.config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConferencesModule } from './conferences/conferences.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        const options = { ...AppDataSource.options };
        return options;
      },
    }),
    AuthModule,
    UserModule,
    BlogsModule,
    ConferencesModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('Database connection has been established successfully.');
    } else {
      console.error('Unable to connect to the database.');
    }
  }
}
