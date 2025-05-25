import { TestingModule, Test } from '@nestjs/testing';
import { MockTokensService } from './mock-tokens.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockToken } from '../../../entities/mock-token.entity';
import { CreateMockTokenDto, UpdateMockTokenDto } from '../dtos/mock-token.dto';
import { NotFoundException } from '@nestjs/common';

describe('MockTokensService', () => {
  let service: MockTokensService;
  let mockTokenRepository: Partial<Repository<MockToken>>;

  beforeEach(async () => {
    mockTokenRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(0), // Assume no data initially for seeding test
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockTokensService,
        {
          provide: getRepositoryToken(MockToken),
          useValue: mockTokenRepository,
        },
      ],
    }).compile();

    service = module.get<MockTokensService>(MockTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a mock token', async () => {
      const createDto: CreateMockTokenDto = { symbol: 'TEST', name: 'Test Token', price_usd: 1, market_cap_usd: 100 };
      const createdToken = new MockToken();
      const savedToken = new MockToken();

      mockTokenRepository.create = jest.fn().mockReturnValue(createdToken);
      mockTokenRepository.save = jest.fn().mockResolvedValue(savedToken);

      const result = await service.create(createDto);

      expect(mockTokenRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockTokenRepository.save).toHaveBeenCalledWith(createdToken);
      expect(result).toBe(savedToken);
    });
  });

  describe('findAll', () => {
    it('should return an array of mock tokens', async () => {
      const expectedTokens: MockToken[] = [new MockToken(), new MockToken()];
      mockTokenRepository.find = jest.fn().mockResolvedValue(expectedTokens);

      const result = await service.findAll();

      expect(mockTokenRepository.find).toHaveBeenCalled();
      expect(result).toBe(expectedTokens);
    });
  });

  describe('findOne', () => {
    it('should return a mock token if found', async () => {
      const symbol = 'TEST';
      const expectedToken = new MockToken();
      mockTokenRepository.findOne = jest.fn().mockResolvedValue(expectedToken);

      const result = await service.findOne(symbol);

      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({ where: { symbol } });
      expect(result).toBe(expectedToken);
    });

    it('should return undefined if mock token not found', async () => {
      const symbol = 'NONEXISTENT';
      mockTokenRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await service.findOne(symbol);

      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({ where: { symbol } });
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update and save a mock token if found', async () => {
      const symbol = 'TEST';
      const updateDto: UpdateMockTokenDto = { price_usd: 2 };
      const existingToken = new MockToken();
      const mergedToken = new MockToken();
      const updatedToken = new MockToken();

      mockTokenRepository.findOne = jest.fn().mockResolvedValue(existingToken);
      mockTokenRepository.merge = jest.fn().mockReturnValue(mergedToken);
      mockTokenRepository.save = jest.fn().mockResolvedValue(updatedToken);

      const result = await service.update(symbol, updateDto);

      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({ where: { symbol } });
      expect(mockTokenRepository.merge).toHaveBeenCalledWith(existingToken, updateDto);
      expect(mockTokenRepository.save).toHaveBeenCalledWith(mergedToken);
      expect(result).toBe(updatedToken);
    });

    it('should throw NotFoundException if mock token not found', async () => {
      const symbol = 'NONEXISTENT';
      const updateDto: UpdateMockTokenDto = { price_usd: 2 };

      mockTokenRepository.findOne = jest.fn().mockResolvedValue(undefined);

      await expect(service.update(symbol, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({ where: { symbol } });
      expect(mockTokenRepository.merge).not.toHaveBeenCalled();
      expect(mockTokenRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a mock token if found', async () => {
      const symbol = 'TEST';
      mockTokenRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await service.remove(symbol);

      expect(mockTokenRepository.delete).toHaveBeenCalledWith({ symbol });
    });

    it('should throw NotFoundException if mock token not found for deletion', async () => {
      const symbol = 'NONEXISTENT';
      mockTokenRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      await expect(service.remove(symbol)).rejects.toThrow(NotFoundException);
      expect(mockTokenRepository.delete).toHaveBeenCalledWith({ symbol });
    });
  });

  describe('onModuleInit', () => {
    it('should seed data if the repository is empty', async () => {
      mockTokenRepository.count = jest.fn().mockResolvedValue(0);
      mockTokenRepository.create = jest.fn().mockImplementation((dto) => dto);
      mockTokenRepository.save = jest.fn().mockResolvedValue(new MockToken());

      await service.onModuleInit();

      expect(mockTokenRepository.count).toHaveBeenCalled();
      expect(mockTokenRepository.create).toHaveBeenCalledTimes(4);
      expect(mockTokenRepository.save).toHaveBeenCalledTimes(4);
    });

    it('should not seed data if the repository is not empty', async () => {
      mockTokenRepository.count = jest.fn().mockResolvedValue(1);
      mockTokenRepository.create = jest.fn();
      mockTokenRepository.save = jest.fn();

      await service.onModuleInit();

      expect(mockTokenRepository.count).toHaveBeenCalled();
      expect(mockTokenRepository.create).not.toHaveBeenCalled();
      expect(mockTokenRepository.save).not.toHaveBeenCalled();
    });
  });
});