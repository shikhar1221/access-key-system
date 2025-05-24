import { Test, TestingModule } from '@nestjs/testing';
import { AccessKeysService } from './services/access-keys.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessKey } from './entities/access-key.entity';
import { Repository } from 'typeorm';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AccessKeyPublisherService } from './services/access-key-publisher.service';
import { AccessKeyRepository } from './repositories/access-key.repository';
import { Logger, NotFoundException } from '@nestjs/common';

// Define a type for the mocked repository methods
type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AccessKeysService', () => {
  let service: AccessKeysService;
  let accessKeyRepository: any;
  let configService: ConfigService;
  let redisService: RedisService;
  let eventEmitter: EventEmitter2;
  let accessKeyPublisherService: MockAccessKeyPublisherService;
  let logger: Logger;

  const mockAccessKeyRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  createAccessKeyEntry: jest.fn(),
};

const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'RATE_LIMIT_DEFAULT') return 100;
      return null;
    }),
  };

  const mockRedisClient = {
    publish: jest.fn(),
  };

  const mockRedisService = {
    getClient: jest.fn(() => mockRedisClient),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  class MockAccessKeyPublisherService {
    publishEvent = jest.fn();
  }



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
          AccessKeysService,
          {
            provide: AccessKeyRepository,
            useValue: mockAccessKeyRepository,
          },
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
          {
            provide: RedisService,
            useValue: mockRedisService,
          },
          {
            provide: EventEmitter2,
            useValue: mockEventEmitter,
          },
          {
            provide: AccessKeyPublisherService,
            useClass: MockAccessKeyPublisherService,
          },
          {
            provide: Logger,
            useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn(), verbose: jest.fn() },
          },
        ],
      }).compile();

    service = module.get<AccessKeysService>(AccessKeysService);
    accessKeyRepository = module.get<MockRepository<AccessKey>>(AccessKeyRepository);
    configService = module.get<ConfigService>(ConfigService);
    redisService = module.get<RedisService>(RedisService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    accessKeyPublisherService = module.get<MockAccessKeyPublisherService>(AccessKeyPublisherService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccessKey', () => {
    it('should create and save an access key', async () => {
      const createAccessKeyDto: CreateAccessKeyDto = {
        userId: 'test-user-id',
        rateLimitPerMinute: 50,
        expiresAt: new Date().toISOString(),
      };
      const expectedAccessKey: AccessKey = {
        id: 'some-uuid',
        userId: createAccessKeyDto.userId,
        apiKey: 'mock-api-key',
        rateLimitPerMinute: createAccessKeyDto.rateLimitPerMinute,
        expiresAt: new Date(createAccessKeyDto.expiresAt),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      accessKeyRepository.createAccessKeyEntry.mockReturnValue(expectedAccessKey);

      const result = await service.createKey(createAccessKeyDto);

      expect(accessKeyRepository.createAccessKeyEntry).toHaveBeenCalledWith({
        ...createAccessKeyDto,
        apiKey: expect.any(String),
        expiresAt: expect.any(Date),
      });
      expect(result).toEqual(expectedAccessKey);
    });

    it('should use default rate limit if not provided', async () => {
      const createAccessKeyDto: CreateAccessKeyDto = {
        userId: 'test-user-id-default',
        rateLimitPerMinute: 100, // Add the missing property
        expiresAt: new Date().toISOString(),
      };
      const expectedAccessKey: AccessKey = {
        id: 'some-uuid',
        userId: createAccessKeyDto.userId,
        apiKey: 'mock-api-key-default',
        rateLimitPerMinute: 100,
        expiresAt: new Date(createAccessKeyDto.expiresAt),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      accessKeyRepository.createAccessKeyEntry.mockReturnValue(expectedAccessKey);

      const result = await service.createKey(createAccessKeyDto);

      expect(accessKeyRepository.createAccessKeyEntry).toHaveBeenCalledWith({
        ...createAccessKeyDto,
        apiKey: expect.any(String),
        expiresAt: expect.any(Date),
      });
      expect(result).toEqual(expectedAccessKey);
    });
  });

  describe('getAccessKey', () => {
    it('should return the access key if found', async () => {
      const apiKey = 'test-api-key';
      const expectedAccessKey = { id: 'test-uuid', apiKey: apiKey } as AccessKey;

      accessKeyRepository.findOne.mockResolvedValue(expectedAccessKey);

      const result = await service.findOneByApiKey(apiKey);

      expect(accessKeyRepository.findOne).toHaveBeenCalledWith({ where: { apiKey } });
      expect(result).toEqual(expectedAccessKey);
    });

    it('should throw NotFoundException if access key not found', async () => {
      const apiKey = 'non-existent-api-key';

      accessKeyRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneByApiKey(apiKey)).rejects.toThrow(NotFoundException);
      expect(accessKeyRepository.findOne).toHaveBeenCalledWith({ where: { apiKey } });
    });
  });

  // Add more tests for other methods like getAllAccessKeys, deleteAccessKey, etc.
});