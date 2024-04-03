import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = ['http://localhost:5173'];
  app.use(
    cors({
      credentials: true,
      origin: (requestOrigin, callback) => {
        console.log(`requestOrigin is ${requestOrigin}`);
        if (
          whitelist.includes(requestOrigin) ||
          typeof requestOrigin === 'undefined'
        ) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
      }
    })
  );

  app.use(
    session({
      secret: 'chat',
      name: 'chat.sid',
      rolling: true,
      cookie: { maxAge: 666666 }
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor()
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Ilucuser')
    .setDescription('user application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
