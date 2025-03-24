// src/patient/dto/create-patient.dto.ts
import { IsNotEmpty, IsEmail, IsOptional, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty({ example: '123 Main St, City, Country', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  medicalHistory?: Record<string, any>;
}