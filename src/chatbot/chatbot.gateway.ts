import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { ChatMessageDto } from './dto/chat-message.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      // Add your frontend URLs
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'chatbot', // Optional: specify a namespace
})
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ChatbotGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private readonly logger = new Logger(ChatbotGateway.name);
  
  @WebSocketServer()
  server: Server;

  // Tracked connected clients
  private connectedClients: Set<string> = new Set();

  constructor(private readonly chatbotService: ChatbotService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.connectedClients.add(client.id);
    this.logger.log(`Client connected: ${client.id}`);
    
    // Optional: Send welcome message
    client.emit('welcome', { 
      message: 'Welcome to the Healthcare Chatbot!',
      connectedClients: this.connectedClients.size 
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatMessageDto: ChatMessageDto,
  ) {
    try {
      this.logger.log(`Received message from ${client.id}: ${chatMessageDto.message}`);
      
      // Process message
      const response = await this.chatbotService.processMessage(chatMessageDto);
      
      // Broadcast to all clients or send to specific client
      client.emit('receiveMessage', response);
      
      // Optional: Broadcast to all connected clients
      // this.server.emit('newMessage', { 
      //   clientId: client.id, 
      //   response 
      // });

      return response;
    } catch (error) {
      this.logger.error(`Message processing error: ${error.message}`);
      client.emit('error', { 
        message: 'Failed to process your message', 
        error: error.message 
      });
    }
  }

  // Additional custom event handlers
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { isTyping: boolean }
  ) {
    // Broadcast typing status to other clients
    client.broadcast.emit('userTyping', { 
      clientId: client.id, 
      isTyping: data.isTyping 
    });
  }

  // Intent detection event
  @SubscribeMessage('detectIntent')
  async handleIntentDetection(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string
  ) {
    try {
      const intent = await this.chatbotService.detectIntent(message);
      client.emit('intentDetected', intent);
      return intent;
    } catch (error) {
      this.logger.error(`Intent detection error: ${error.message}`);
      client.emit('error', { 
        message: 'Failed to detect intent', 
        error: error.message 
      });
    }
  }
}