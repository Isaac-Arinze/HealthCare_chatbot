// src/pharmacy/pharmacy.service.ts
import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacy } from './pharmacy.entity';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';

@Injectable()
export class PharmacyService {
  private readonly logger = new Logger(PharmacyService.name);

  constructor(
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
  ) {}

  async create(createPharmacyDto: CreatePharmacyDto): Promise<Pharmacy> {
    try {
      const pharmacy = this.pharmacyRepository.create(createPharmacyDto);
      return await this.pharmacyRepository.save(pharmacy);
    } catch (error) {
      this.logger.error(`Error creating pharmacy: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Pharmacy[]> {
    return this.pharmacyRepository.find();
  }

  async findOne(id: string): Promise<Pharmacy> {
    const pharmacy = await this.pharmacyRepository.findOne({ where: { id: Number(id) } });
    
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID ${id} not found`);
    }
    
    return pharmacy;
  }

  async update(id: string, updatePharmacyDto: Partial<CreatePharmacyDto>): Promise<Pharmacy> {
    const pharmacy = await this.findOne(id);
    Object.assign(pharmacy, updatePharmacyDto);
    return this.pharmacyRepository.save(pharmacy);
  }

  async remove(id: string): Promise<void> {
    const result = await this.pharmacyRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Pharmacy with ID ${id} not found`);
    }
  }
}
