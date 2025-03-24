import { 
    WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage, 
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatbotService } from './chatbot.service';
  import { Logger } from '@nestjs/common';
  import { ChatMessageDto } from './dto/chat-message.dto';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChatbotGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatbotGateway.name);
    
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly chatbotService: ChatbotService) {}
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() chatMessageDto: ChatMessageDto,
    ) {
      this.logger.log(`Received message from ${client.id}: ${chatMessageDto.message}`);
      
      const response = await this.chatbotService.processMessage(chatMessageDto);
      
      // Send the response back to the specific client
      client.emit('receiveMessage', response);
      
      return response;
    }
  }