import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName: string = 'gemini-1.5-pro';
  private context: Record<string, any[]> = {}; // Context storage for users

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async processMessage(chatMessageDto: { message: string; userId: string }): Promise<{ response: string }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      this.logger.log(`Processing message for user ${chatMessageDto.userId}: ${chatMessageDto.message}`);

      // Maintain conversation history
      this.context[chatMessageDto.userId] = this.context[chatMessageDto.userId] || [];
      this.context[chatMessageDto.userId].push({
        role: 'user',
        parts: [{ text: chatMessageDto.message }],
      });

      const result = await model.generateContent({ contents: this.context[chatMessageDto.userId] });

      // Extract response correctly
      const text = result.response.text() || 'No response received';


      // Store bot response in history
      this.context[chatMessageDto.userId].push({
        role: 'model',
        parts: [{ text }],
      });

      this.logger.log(`Response for user ${chatMessageDto.userId}: ${text}`);

      return { response: text };
    } catch (error) {
      this.logger.error(`Error calling Gemini API: ${error.message}`, error.stack);
      return { response: "I'm sorry, I'm having trouble processing your request right now. Please try again later." };
    }
  }

  async detectIntent(message: string): Promise<{ intent: string }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      this.logger.log(`Detecting intent for message: ${message}`);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `Detect the intent of this message: ${message}` }] }],
      });

      const intent = result.response.text() || 'unknown';

         this.logger.log(`Detected intent: ${intent}`);

      return { intent };
    } catch (error) {
      this.logger.error(`Error detecting intent: ${error.message}`, error.stack);
      return { intent: 'unknown' };
    }
  }
}
