import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockToken } from '../entities/mock-token.entity';
import { CreateMockTokenDto, UpdateMockTokenDto } from '../dtos/mock-token.dto';

@Injectable()
export class MockTokensService {
  constructor(
    @InjectRepository(MockToken)
    private readonly mockTokenRepository: Repository<MockToken>,
  ) {}

  async create(createMockTokenDto: CreateMockTokenDto): Promise<MockToken> {
    const token = this.mockTokenRepository.create(createMockTokenDto);
    return this.mockTokenRepository.save(token);
  }

  async findAll(): Promise<MockToken[]> {
    return this.mockTokenRepository.find();
  }

  async findOne(symbol: string): Promise<MockToken | undefined> {
    return this.mockTokenRepository.findOne({ where: { symbol } });
  }

  async update(symbol: string, updateMockTokenDto: UpdateMockTokenDto): Promise<MockToken> {
    const token = await this.findOne(symbol);
    if (!token) {
      throw new NotFoundException(`MockToken with symbol "${symbol}" not found`);
    }
    const updatedToken = this.mockTokenRepository.merge(token, updateMockTokenDto);
    return this.mockTokenRepository.save(updatedToken);
  }

  async remove(symbol: string): Promise<void> {
    const result = await this.mockTokenRepository.delete({ symbol });
    if (result.affected === 0) {
      throw new NotFoundException(`MockToken with symbol "${symbol}" not found for deletion`);
    }
  }

  // Seed initial mock data if needed
  async onModuleInit() {
    // Check if data exists to avoid re-seeding
    const count = await this.mockTokenRepository.count();
    if (count === 0) {
      const mockData: CreateMockTokenDto[] = [
        { symbol: 'BTC', name: 'Bitcoin', price_usd: 60000.00, market_cap_usd: 1200000000000 },
        { symbol: 'ETH', name: 'Ethereum', price_usd: 3000.00, market_cap_usd: 360000000000 },
        { symbol: 'SOL', name: 'Solana', price_usd: 150.00, market_cap_usd: 60000000000 },
        { symbol: 'ADA', name: 'Cardano', price_usd: 0.50, market_cap_usd: 18000000000 },
      ];
      for (const data of mockData) {
        await this.create(data);
      }
      console.log('Mock token data seeded.');
    }
  }
}