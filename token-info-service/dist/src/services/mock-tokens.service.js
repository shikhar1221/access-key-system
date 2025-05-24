"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTokensService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mock_token_entity_1 = require("../entities/mock-token.entity");
let MockTokensService = class MockTokensService {
    constructor(mockTokenRepository) {
        this.mockTokenRepository = mockTokenRepository;
    }
    async create(createMockTokenDto) {
        const token = this.mockTokenRepository.create(createMockTokenDto);
        return this.mockTokenRepository.save(token);
    }
    async findAll() {
        return this.mockTokenRepository.find();
    }
    async findOne(symbol) {
        return this.mockTokenRepository.findOne({ where: { symbol } });
    }
    async update(symbol, updateMockTokenDto) {
        const token = await this.findOne(symbol);
        if (!token) {
            throw new common_1.NotFoundException(`MockToken with symbol "${symbol}" not found`);
        }
        const updatedToken = this.mockTokenRepository.merge(token, updateMockTokenDto);
        return this.mockTokenRepository.save(updatedToken);
    }
    async remove(symbol) {
        const result = await this.mockTokenRepository.delete({ symbol });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`MockToken with symbol "${symbol}" not found for deletion`);
        }
    }
    async onModuleInit() {
        const count = await this.mockTokenRepository.count();
        if (count === 0) {
            const mockData = [
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
};
MockTokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mock_token_entity_1.MockToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MockTokensService);
exports.MockTokensService = MockTokensService;
