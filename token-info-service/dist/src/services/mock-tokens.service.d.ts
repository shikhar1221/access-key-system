import { Repository } from 'typeorm';
import { MockToken } from '../entities/mock-token.entity';
import { CreateMockTokenDto, UpdateMockTokenDto } from '../dtos/mock-token.dto';
export declare class MockTokensService {
    private readonly mockTokenRepository;
    constructor(mockTokenRepository: Repository<MockToken>);
    create(createMockTokenDto: CreateMockTokenDto): Promise<MockToken>;
    findAll(): Promise<MockToken[]>;
    findOne(symbol: string): Promise<MockToken | undefined>;
    update(symbol: string, updateMockTokenDto: UpdateMockTokenDto): Promise<MockToken>;
    remove(symbol: string): Promise<void>;
    onModuleInit(): Promise<void>;
}
