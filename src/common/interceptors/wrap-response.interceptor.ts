import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe(
      map((data) => ({ code: 200, message: 'Success', data })),
      catchError((error) => {
        console.log(error);
        const errorMessage = error.message || 'Internal Server Error';
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        return throwError(
          () =>
            new HttpException(
              {
                code: statusCode,
                message: errorMessage
                // data: null
              },
              statusCode
            )
        );
      }),
      tap((data) => console.log('After...', data))
    );
  }
}
