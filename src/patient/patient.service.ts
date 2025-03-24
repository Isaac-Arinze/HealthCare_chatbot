// src/patient/patient.service.ts
import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      // Check if patient with email already exists
      const existingPatient = await this.patientRepository.findOne({ 
        where: { email: createPatientDto.email } 
      });
      
      if (existingPatient) {
        throw new ConflictException(`Patient with email ${createPatientDto.email} already exists`);
      }

      const patient = this.patientRepository.create(createPatientDto);
      return await this.patientRepository.save(patient);
    } catch (error) {
      this.logger.error(`Error creating patient: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id: Number(id) } });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    return patient;
  }

  async findByEmail(email: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { email } });
    
    if (!patient) {
      throw new NotFoundException(`Patient with email ${email} not found`);
    }
    
    return patient;
  }

  async update(id: string, updatePatientDto: Partial<CreatePatientDto>): Promise<Patient> {
    const patient = await this.findOne(id);
    
    // Update patient properties
    Object.assign(patient, updatePatientDto);
    
    return this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async updateMedicalHistory(id: string, medicalHistory: Record<string, any>): Promise<Patient> {
    const patient = await this.findOne(id);
    
    // Merge existing medical history with new data
    patient.medicalHistory = {
      ...patient.medicalHistory,
      ...medicalHistory,
    };
    
    return this.patientRepository.save(patient);
  }
}