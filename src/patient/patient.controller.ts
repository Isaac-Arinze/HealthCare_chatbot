// src/patient/patient.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put, 
    Delete, 
    HttpCode, 
    HttpStatus,
    Query
  } from '@nestjs/common';
  import { PatientService } from './patient.service';
  import { CreatePatientDto } from './dto/create-patient.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
  import { Patient } from './patient.entity';
  
  @ApiTags('patients')
  @Controller('patients')
  export class PatientController {
    constructor(private readonly patientService: PatientService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new patient' })
    @ApiResponse({ status: 201, description: 'The patient has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 409, description: 'Conflict - Patient with the email already exists.' })
    async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
      return this.patientService.create(createPatientDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all patients' })
    @ApiResponse({ status: 200, description: 'Return all patients.' })
    async findAll(): Promise<Patient[]> {
      return this.patientService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a patient by ID' })
    @ApiParam({ name: 'id', description: 'Patient ID' })
    @ApiResponse({ status: 200, description: 'Return the patient.' })
    @ApiResponse({ status: 404, description: 'Patient not found.' })
    async findOne(@Param('id') id: string): Promise<Patient> {
      return this.patientService.findOne(id);
    }
  
    @Get('email/find')
    @ApiOperation({ summary: 'Get a patient by email' })
    @ApiQuery({ name: 'email', description: 'Patient email' })
    @ApiResponse({ status: 200, description: 'Return the patient.' })
    @ApiResponse({ status: 404, description: 'Patient not found.' })
    async findByEmail(@Query('email') email: string): Promise<Patient> {
      return this.patientService.findByEmail(email);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a patient' })
    @ApiParam({ name: 'id', description: 'Patient ID' })
    @ApiResponse({ status: 200, description: 'The patient has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Patient not found.' })
    async update(
      @Param('id') id: string,
      @Body() updatePatientDto: Partial<CreatePatientDto>,
    ): Promise<Patient> {
      return this.patientService.update(id, updatePatientDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a patient' })
    @ApiParam({ name: 'id', description: 'Patient ID' })
    @ApiResponse({ status: 204, description: 'The patient has been successfully removed.' })
    @ApiResponse({ status: 404, description: 'Patient not found.' })
    async remove(@Param('id') id: string): Promise<void> {
      return this.patientService.remove(id);
    }
  
    @Put(':id/medical-history')
    @ApiOperation({ summary: 'Update patient medical history' })
    @ApiParam({ name: 'id', description: 'Patient ID' })
    @ApiResponse({ status: 200, description: 'The medical history has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Patient not found.' })
    async updateMedicalHistory(
      @Param('id') id: string,
      @Body() medicalHistory: Record<string, any>,
    ): Promise<Patient> {
      return this.patientService.updateMedicalHistory(id, medicalHistory);
    }
  }