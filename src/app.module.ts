import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserAuthModule } from './modules/user-auth/user-auth.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(3306)
      })
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // 数据库类型
      host: process.env.DATABASE_HOST, // host
      port: +process.env.DATABASE_PORT, // 端口
      username: process.env.DATABASE_USER, // 账号
      password: process.env.DATABASE_PASSWORD, // 密码
      database: process.env.DATABASE_NAME, // 库名
      //   entities: [__dirname + '/**/*.entity{.ts,.js}'], // 实体文件
      autoLoadEntities: true, // 如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
      synchronize: true, // synchronize字段代表是否自动将实体类同步到数据库，生产环境中需关闭
      retryDelay: 500, // 重试连接数据库间隔
      retryAttempts: 10 // 重试连接数据库的次数
    }),
    UserModule,
    UserAuthModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
