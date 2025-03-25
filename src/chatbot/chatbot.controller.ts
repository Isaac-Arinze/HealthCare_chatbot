import { Controller, Post, Body, InternalServerErrorException, Logger } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('chatbot')
export class ChatbotController {
  private readonly logger = new Logger(ChatbotController.name);

  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async processMessage(@Body() chatMessageDto: ChatMessageDto): Promise<{ response: string }> {
    try {
      return await this.chatbotService.processMessage(chatMessageDto);
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`, error.stack);
      throw new InternalServerErrorException("AI service is currently unavailable.");
    }
  }

  @Post('detect-intent')
  async detectIntent(@Body('message') message: string): Promise<{ intent: string }> {
    try {
      return await this.chatbotService.detectIntent(message);
    } catch (error) {
      this.logger.error(`Error detecting intent: ${error.message}`, error.stack);
      throw new InternalServerErrorException("Intent detection failed.");
    }
  }
}
