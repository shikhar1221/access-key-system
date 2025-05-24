import { Test, TestingModule } from '@nestjs/testing';
import { TokenInfoService } from './token-info.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenInfo } from '../token-info/entities/token-info.entity';
import { Repository } from 'typeorm';
import { CreateTokenInfoDto } from '../token-info/dtos/create-token-info.dto';
import { UpdateTokenInfoDto } from '../token-info/dtos/update-token-info.dto';

describe('TokenInfoService', () => {
  let service: TokenInfoService;
  let tokenInfoRepository: Repository<TokenInfo>;

  const mockTokenInfoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenInfoService,
        {
          provide: getRepositoryToken(TokenInfo),
          useValue: mockTokenInfoRepository,
        },
      ],
    }).compile();

    service = module.get<TokenInfoService>(TokenInfoService);
    tokenInfoRepository = module.get<Repository<TokenInfo>>(getRepositoryToken(TokenInfo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTokenInfo', () => {
    it('should create and save token info', async () => {
      const createTokenInfoDto: CreateTokenInfoDto = {
        token: 'test-token',
        info: { userId: 'user123' },
      };
      const expectedTokenInfo = { id: 'some-uuid', ...createTokenInfoDto };

      mockTokenInfoRepository.create.mockReturnValue(expectedTokenInfo);
      mockTokenInfoRepository.save.mockResolvedValue(expectedTokenInfo);

      const result = await service.createTokenInfo(createTokenInfoDto);

      expect(tokenInfoRepository.create).toHaveBeenCalledWith(createTokenInfoDto);
      expect(tokenInfoRepository.save).toHaveBeenCalledWith(expectedTokenInfo);
      expect(result).toEqual(expectedTokenInfo);
    });
  });

  describe('getTokenInfo', () => {
    it('should return token info if found', async () => {
      const token = 'test-token';
      const expectedTokenInfo = { id: 'some-uuid', token, info: { userId: 'user123' } };

      mockTokenInfoRepository.findOne.mockResolvedValue(expectedTokenInfo);

      const result = await service.getTokenInfo(token);

      expect(tokenInfoRepository.findOne).toHaveBeenCalledWith({ where: { token } });
      expect(result).toEqual(expectedTokenInfo);
    });

    it('should return null if token info not found', async () => {
      const token = 'non-existent-token';

      mockTokenInfoRepository.findOne.mockResolvedValue(null);

      const result = await service.getTokenInfo(token);

      expect(tokenInfoRepository.findOne).toHaveBeenCalledWith({ where: { token } });
      expect(result).toBeNull();
    });
  });

  describe('updateTokenInfo', () => {
    it('should update token info', async () => {
      const token = 'test-token';
      const updateTokenInfoDto: UpdateTokenInfoDto = { info: { userId: 'user456' } };
      const existingTokenInfo = { id: 'some-uuid', token, info: { userId: 'user123' } };
      const updatedTokenInfo = { ...existingTokenInfo, ...updateTokenInfoDto };

      mockTokenInfoRepository.findOne.mockResolvedValue(existingTokenInfo);
      mockTokenInfoRepository.update.mockResolvedValue({ affected: 1 });
      mockTokenInfoRepository.findOne.mockResolvedValueOnce(existingTokenInfo).mockResolvedValueOnce(updatedTokenInfo);

      const result = await service.updateTokenInfo(token, updateTokenInfoDto);

      expect(tokenInfoRepository.findOne).toHaveBeenCalledWith({ where: { token } });
      expect(tokenInfoRepository.update).toHaveBeenCalledWith({ token }, updateTokenInfoDto);
      expect(result).toEqual(updatedTokenInfo);
    });

    it('should return null if token info not found for update', async () => {
      const token = 'non-existent-token';
      const updateTokenInfoDto: UpdateTokenInfoDto = { info: { userId: 'user456' } };

      mockTokenInfoRepository.findOne.mockResolvedValue(null);

      const result = await service.updateTokenInfo(token, updateTokenInfoDto);

      expect(tokenInfoRepository.findOne).toHaveBeenCalledWith({ where: { token } });
      expect(result).toBeNull();
    });
  });

  describe('deleteTokenInfo', () => {
    it('should delete token info', async () => {
      const token = 'test-token';
      const existingTokenInfo = { id: 'some-uuid', token, info: { userId: 'user123' } };

      mockTokenInfoRepository.findOne.mockResolvedValue(existingTokenInfo);
      mockTokenInfoRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteTokenInfo(token);

      expect(tokenInfoRepository.findOne).toHaveBeenCalledWith({ where: { token } });
      expect(tokenInfoRepository.delete).toHaveBeenCalledWith({ token });
      expect(result).toBe(true);
    });

    it('should return false if token info not found for deletion', async () => {
      const token = 'non-existent-token';

      mockTokenInfoRepository.findOne.mockResolvedValue(null);

      const result = await service.deleteTokenInfo(token);

      expect(tokenInfoRepository.findOne).toHaveBeenCalledWith({ where: { token } });
      expect(result).toBe(false);
    });
  });
});