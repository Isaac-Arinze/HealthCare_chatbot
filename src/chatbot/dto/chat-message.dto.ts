import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ description: 'User message', example: 'Hello, how are you?' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'User ID', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}