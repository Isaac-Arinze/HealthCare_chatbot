import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    description: 'The user message content',
    example: 'What are the visiting hours?',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The user ID or session ID',
    example: 'c58f986b-db06-4d72-9f12-f56b9e893c3b',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The conversation context',
    required: false,
  })
  @IsOptional()
  context?: Record<string, any>;
}