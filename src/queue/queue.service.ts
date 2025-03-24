// src/queue/queue.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
  ) {}

  async create(createQueueDto: CreateQueueDto): Promise<Queue> {
    try {
      const queue = this.queueRepository.create(createQueueDto);
      return await this.queueRepository.save(queue);
    } catch (error) {
      this.logger.error(`Error creating queue: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Queue[]> {
    return this.queueRepository.find();
  }

  async findOne(id: string): Promise<Queue> {
    const queue = await this.queueRepository.findOne({ where: { id: Number(id) } });
    
    if (!queue) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }
    
    return queue;
  }

  async updateStatus(id: string, status: string): Promise<Queue> {
    const queue = await this.findOne(id);
    queue.status = status;
    return this.queueRepository.save(queue);
  }

  async remove(id: string): Promise<void> {
    const result = await this.queueRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }
  }
}