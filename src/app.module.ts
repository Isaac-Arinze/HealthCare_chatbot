import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotModule } from './chatbot/chatbot.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { QueueModule } from './queue/queue.module';
import { EhrModule } from './ehr/ehr.module';
import { LabModule } from './lab/lab.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    }),

    // Configure TypeORM for database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'newpassword',
      database: process.env.DB_NAME || 'healthcare_chatbot',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-load entities
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync schema in development
    }),

    // Feature modules
    ChatbotModule,
    PatientModule,
    AppointmentModule,
    QueueModule,
    EhrModule,
    LabModule,
    PharmacyModule,
    BillingModule,
  ],
  controllers: [], // Remove unnecessary controllers
  providers: [], // Add global providers if needed
})
export class AppModule {}