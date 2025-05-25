import { TestingModule, Test } from '@nestjs/testing';
import { RequestLogsService } from './request-logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from '../../../entities/request-log.entity';
import { CreateRequestLogDto } from '../dtos/request-log.dto';

describe('RequestLogsService', () => {
  let service: RequestLogsService;
  let mockRequestLogRepository: Partial<Repository<RequestLog>>;

  beforeEach(async () => {
    mockRequestLogRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestLogsService,
        {
          provide: getRepositoryToken(RequestLog),
          useValue: mockRequestLogRepository,
        },
      ],
    }).compile();

    service = module.get<RequestLogsService>(RequestLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLog', () => {
    it('should create a request log', async () => {
      const createDto = {
        apiKey: 'test-api-key',
        requestPath: '/test-path',
        timestamp: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'jest',
        isRateLimited: false,
        isSuccessful: true,
        errorMessage: null,
      };
      const createdLog = new RequestLog();
      const savedLog = new RequestLog();

      mockRequestLogRepository.create = jest.fn().mockReturnValue(createdLog);
      mockRequestLogRepository.save = jest.fn().mockResolvedValue(savedLog);

      const result = await service.createLog(createDto);

      expect(mockRequestLogRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRequestLogRepository.save).toHaveBeenCalledWith(createdLog);
      expect(result).toBe(savedLog);
    });
  });

  describe('findAllByApiKey', () => {
    it('should return an array of request logs for a given API key', async () => {
      const apiKey = 'test-key';
      const expectedLogs: RequestLog[] = [new RequestLog(), new RequestLog()];
      mockRequestLogRepository.find = jest.fn().mockResolvedValue(expectedLogs);

      const result = await service.findAllByApiKey(apiKey);

      expect(mockRequestLogRepository.find).toHaveBeenCalledWith({
        where: { apiKey },
        order: { timestamp: 'DESC' },
      });
      expect(result).toBe(expectedLogs);
    });

    it('should return an empty array if no request logs found for the API key', async () => {
      const apiKey = 'non-existent-key';
      const expectedLogs: RequestLog[] = [];
      mockRequestLogRepository.find = jest.fn().mockResolvedValue(expectedLogs);

      const result = await service.findAllByApiKey(apiKey);

      expect(mockRequestLogRepository.find).toHaveBeenCalledWith({
        where: { apiKey },
        order: { timestamp: 'DESC' },
      });
      expect(result).toBe(expectedLogs);
    });
  });
});