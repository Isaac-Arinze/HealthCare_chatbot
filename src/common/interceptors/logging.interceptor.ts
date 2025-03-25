
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const client = context.switchToWs().getClient();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log(`WebSocket operation completed in ${Date.now() - now}ms`);
        },
        error: (err) => {
          this.logger.error(`WebSocket operation failed: ${err.message}`);
        }
      })
    );
  }
}