import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from '../../../entities/request-log.entity';
import { CreateRequestLogDto } from '../dtos/request-log.dto';

@Injectable()
export class RequestLogsService {
  constructor(
    @InjectRepository(RequestLog)
    private readonly requestLogRepository: Repository<RequestLog>,
  ) {}

  async createLog(createLogDto: CreateRequestLogDto): Promise<RequestLog> {
    const newLog = this.requestLogRepository.create(createLogDto);
    return this.requestLogRepository.save(newLog);
  }

  async findAllByApiKey(apiKey: string): Promise<RequestLog[]> {
    return this.requestLogRepository.find({ where: { apiKey }, order: { timestamp: 'DESC' } });
  }
}