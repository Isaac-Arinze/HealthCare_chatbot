// src/pharmacy/pharmacy.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Pharmacy } from './pharmacy.entity';

@ApiTags('pharmacy')
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pharmacy' })
  @ApiResponse({ status: 201, description: 'Pharmacy created successfully.' })
  async create(@Body() createPharmacyDto: CreatePharmacyDto): Promise<Pharmacy> {
    return this.pharmacyService.create(createPharmacyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pharmacies' })
  @ApiResponse({ status: 200, description: 'Return all pharmacies.' })
  async findAll(): Promise<Pharmacy[]> {
    return this.pharmacyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pharmacy by ID' })
  @ApiParam({ name: 'id', description: 'Pharmacy ID' })
  @ApiResponse({ status: 200, description: 'Return the pharmacy.' })
  @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
  async findOne(@Param('id') id: string): Promise<Pharmacy> {
    return this.pharmacyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a pharmacy' })
  @ApiParam({ name: 'id', description: 'Pharmacy ID' })
  @ApiResponse({ status: 200, description: 'Pharmacy updated successfully.' })
  @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
  async update(
    @Param('id') id: string,
    @Body() updatePharmacyDto: Partial<CreatePharmacyDto>,
  ): Promise<Pharmacy> {
    return this.pharmacyService.update(id, updatePharmacyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a pharmacy' })
  @ApiParam({ name: 'id', description: 'Pharmacy ID' })
  @ApiResponse({ status: 204, description: 'Pharmacy deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.pharmacyService.remove(id);
  }
}