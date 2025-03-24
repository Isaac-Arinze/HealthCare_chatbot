// src/pharmacy/dto/create-pharmacy.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePharmacyDto {
  @ApiProperty({ example: 'Green Pharmacy' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Main St, City, Country' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: { 'Paracetamol': 100, 'Ibuprofen': 50 }, required: false })
  @IsOptional()
  medications?: Record<string, any>;
}