import { TestingModule, Test } from '@nestjs/testing';
import { DuplicatedKeysService } from './duplicated-keys.service';
import { DuplicatedAccessKeyRepository } from '../../../shared/repositories/duplicated-access-key.repository';
import { DuplicatedAccessKey } from '../../../entities/duplicated-access-key.entity';
import { CreateDuplicatedAccessKeyDto, UpdateDuplicatedAccessKeyDto } from '../dtos/duplicated-access-key.dto';

describe('DuplicatedKeysService', () => {
  let service: DuplicatedKeysService;
  let mockRepository: Partial<DuplicatedAccessKeyRepository>;

  beforeEach(async () => {
    mockRepository = {
      findOneByApiKey: jest.fn(),
      upsertKey: jest.fn(),
      updateKey: jest.fn(),
      deleteKey: jest.fn(),
      setKeyActiveStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DuplicatedKeysService,
        {
          provide: DuplicatedAccessKeyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DuplicatedKeysService>(DuplicatedKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a duplicated key if found', async () => {
      const apiKey = 'test-key';
      const expectedKey = new DuplicatedAccessKey();
      mockRepository.findOneByApiKey = jest.fn().mockResolvedValue(expectedKey);

      const result = await service.findOne(apiKey);

      expect(result).toBe(expectedKey);
      expect(mockRepository.findOneByApiKey).toHaveBeenCalledWith(apiKey);
    });

    it('should return undefined if duplicated key not found', async () => {
      const apiKey = 'non-existent-key';
      mockRepository.findOneByApiKey = jest.fn().mockResolvedValue(undefined);

      const result = await service.findOne(apiKey);

      expect(result).toBeUndefined();
      expect(mockRepository.findOneByApiKey).toHaveBeenCalledWith(apiKey);
    });
  });

  describe('upsertDuplicatedKey', () => {
    it('should upsert a duplicated key', async () => {
      const createDto: CreateDuplicatedAccessKeyDto = {
        apiKey: 'new-key',
        rateLimitPerMinute: 100,
        expiresAt: new Date().toISOString(),
        isActive: true,
      };
      const expectedKey = new DuplicatedAccessKey();
      mockRepository.upsertKey = jest.fn().mockResolvedValue(expectedKey);

      const result = await service.upsertDuplicatedKey(createDto);

      expect(result).toBe(expectedKey);
      expect(mockRepository.upsertKey).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateDuplicatedKey', () => {
    it('should update a duplicated key', async () => {
      const apiKey = 'update-key';
      const updateDto: UpdateDuplicatedAccessKeyDto = {
        rateLimitPerMinute: 200,
        isActive: false,
      };
      const expectedKey = new DuplicatedAccessKey();
      mockRepository.updateKey = jest.fn().mockResolvedValue(expectedKey);

      const result = await service.updateDuplicatedKey(apiKey, updateDto);

      expect(result).toBe(expectedKey);
      expect(mockRepository.updateKey).toHaveBeenCalledWith(apiKey, updateDto);
    });
  });

  describe('deleteDuplicatedKey', () => {
    it('should delete a duplicated key', async () => {
      const apiKey = 'delete-key';
      mockRepository.deleteKey = jest.fn().mockResolvedValue(undefined);

      await service.deleteDuplicatedKey(apiKey);

      expect(mockRepository.deleteKey).toHaveBeenCalledWith(apiKey);
    });
  });

  describe('setKeyActiveStatus', () => {
    it('should set the active status of a duplicated key', async () => {
      const apiKey = 'status-key';
      const isActive = false;
      const expectedKey = new DuplicatedAccessKey();
      mockRepository.setKeyActiveStatus = jest.fn().mockResolvedValue(expectedKey);

      const result = await service.setKeyActiveStatus(apiKey, isActive);

      expect(result).toBe(expectedKey);
      expect(mockRepository.setKeyActiveStatus).toHaveBeenCalledWith(apiKey, isActive);
    });
  });
});