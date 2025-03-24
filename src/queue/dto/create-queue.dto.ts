// src/queue/dto/create-queue.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQueueDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  pharmacyId: number;

  @ApiProperty({ example: 'pending', required: false })
  status?: string;
}