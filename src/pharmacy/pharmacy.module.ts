// src/pharmacy/pharmacy.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';
import { Pharmacy } from './pharmacy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy])],
  controllers: [PharmacyController],
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}