// src/queue/queue.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Queue } from './queue.entity';

@ApiTags('queue')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new queue entry' })
  @ApiResponse({ status: 201, description: 'Queue entry created successfully.' })
  async create(@Body() createQueueDto: CreateQueueDto): Promise<Queue> {
    return this.queueService.create(createQueueDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all queue entries' })
  @ApiResponse({ status: 200, description: 'Return all queue entries.' })
  async findAll(): Promise<Queue[]> {
    return this.queueService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a queue entry by ID' })
  @ApiParam({ name: 'id', description: 'Queue ID' })
  @ApiResponse({ status: 200, description: 'Return the queue entry.' })
  @ApiResponse({ status: 404, description: 'Queue entry not found.' })
  async findOne(@Param('id') id: string): Promise<Queue> {
    return this.queueService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update queue status' })
  @ApiParam({ name: 'id', description: 'Queue ID' })
  @ApiResponse({ status: 200, description: 'Queue status updated successfully.' })
  @ApiResponse({ status: 404, description: 'Queue entry not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Queue> {
    return this.queueService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a queue entry' })
  @ApiParam({ name: 'id', description: 'Queue ID' })
  @ApiResponse({ status: 204, description: 'Queue entry deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Queue entry not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.queueService.remove(id);
  }
}