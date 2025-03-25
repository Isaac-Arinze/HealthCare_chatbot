import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class HttpExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    
    if (exception instanceof WsException) {
      client.emit('error', {
        type: 'WebSocket Error',
        message: exception.message
      });
    } else {
      client.emit('error', {
        type: 'Unexpected Error',
        message: 'An unexpected error occurred'
      });
    }
  }
}   