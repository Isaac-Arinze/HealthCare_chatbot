import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async processMessage(@Body() chatMessageDto: ChatMessageDto): Promise<{ response: string }> {
    return this.chatbotService.processMessage(chatMessageDto);
  }

  @Post('detect-intent')
  async detectIntent(@Body('message') message: string): Promise<string> {
    const { intent } = await this.chatbotService.detectIntent(message);
    return intent;
  }
}