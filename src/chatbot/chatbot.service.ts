import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName: string = 'gemini-1.5-pro'; // Updated model name
  private context: any = {}; // Context storage

  constructor(private readonly configService: ConfigService) {
    // Initialize the Gemini API client with the API key
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async processMessage(chatMessageDto: { message: string; userId: string; context?: any }): Promise<{ response: string }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      // Log the request being sent to the Gemini API
      this.logger.log(`Sending message to Gemini API using model ${this.modelName}: ${chatMessageDto.message}`);

      // Update context with the new message
      this.context[chatMessageDto.userId] = this.context[chatMessageDto.userId] || [];
      this.context[chatMessageDto.userId].push({ role: 'user', parts: [{ text: chatMessageDto.message }] });

      // Send the user message and context to the Gemini model
      const result = await model.generateContent({
        contents: this.context[chatMessageDto.userId],
      });

      const response = await result.response;
      const text = response.text();

      // Update context with the model's response
      this.context[chatMessageDto.userId].push({ role: 'model', parts: [{ text }] });

      // Log the response from the Gemini API
      this.logger.log(`Received response from Gemini API: ${text}`);

      return { response: text };
    } catch (error) {
      this.logger.error(`Error calling Gemini API: ${error.message}`, error.stack);

      // Check if the error contains model not found message
      if (error.message && error.message.includes('not found for API version')) {
        // Try with alternative model name
        try {
          this.logger.log('Attempting with alternative model name: gemini-pro');
          const alternativeModel = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

          const result = await alternativeModel.generateContent({
            contents: this.context[chatMessageDto.userId],
          });

          const response = await result.response;
          const text = response.text();
          return { response: text };
        } catch (fallbackError) {
          this.logger.error(`Fallback also failed: ${fallbackError.message}`);
        }
      }

      // Fallback response if the API fails
      return {
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
      };
    }
  }

  async detectIntent(message: string): Promise<{ intent: string }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      // Log the request being sent to the Gemini API
      this.logger.log(`Detecting intent for message: ${message}`);

      // Send the message to the Gemini model for intent detection
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `Detect the intent of this message: ${message}` }]
        }]
      });
      const response = await result.response;
      const text = response.text();

      // Log the response from the Gemini API
      this.logger.log(`Detected intent: ${text}`);

      return { intent: text };
    } catch (error) {
      this.logger.error(`Error detecting intent: ${error.message}`, error.stack);
      return { intent: 'unknown' };
    }
  }
}