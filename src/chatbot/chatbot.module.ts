// src/chatbot/chatbot.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [ConfigModule.forRoot()], // Load environment variables
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}