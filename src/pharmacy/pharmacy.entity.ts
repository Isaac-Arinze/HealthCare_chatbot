// src/pharmacy/pharmacy.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  medications: Record<string, any>; // Stores available medications and their quantities
}