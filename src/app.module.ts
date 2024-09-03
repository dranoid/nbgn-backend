import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BlogsModule } from './blogs/blogs.module';
import { ConferencesModule } from './conferences/conferences.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from '../typeorm.config';
import { DataSource } from 'typeorm';

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
        // return {
        //   type: 'postgres',
        //   host: configService.get<string>('DB_HOST'),
        //   port: configService.get<number>('DB_PORT'),
        //   username: configService.get<string>('DB_USER'),
        //   password: configService.get<string>('DB_PASSWORD'),
        //   database: configService.get<string>('DB_NAME'),
        //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
        //   migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
        //   ssl: {
        //     rejectUnauthorized: true,
        //     ca: configService.get('DB_CA_CERT'),
        //   },
        // };
      },
    }),
    AuthModule,
    UserModule,
    BlogsModule,
    ConferencesModule,
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
