import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { MockTokenDto } from '../src/modules/token-info/dtos/mock-token.dto';
import { DuplicatedKeysService } from '../src/services/duplicated-keys.service';
import { MockTokensService } from '../src/services/mock-tokens.service';
import { CreateDuplicatedAccessKeyDto } from '../src/modules/token-info/dtos/duplicated-access-key.dto';
import { DataSource } from 'typeorm'; // Import DataSource
import { Redis } from 'ioredis'; // Import Redis type

describe('TokenInfoController (e2e)', () => {
  let app: INestApplication;
  let duplicatedKeysService: DuplicatedKeysService;
  let mockTokensService: MockTokensService;

  const testApiKey = 'e2e-test-api-key';
  const testSymbol = 'BTC'; // Assuming BTC is seeded by MockTokensService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    duplicatedKeysService = moduleFixture.get<DuplicatedKeysService>(DuplicatedKeysService);
    mockTokensService = moduleFixture.get<MockTokensService>(MockTokensService);

    // Create a test API key
    const createKeyDto: CreateDuplicatedAccessKeyDto = {
      apiKey: testApiKey,
      rateLimitPerMinute: 1000,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Valid for 1 year
      isActive: true,
    };
    await duplicatedKeysService.upsertDuplicatedKey(createKeyDto);

    // Ensure mock token data is seeded (MockTokensService.onModuleInit should handle this)
    // await mockTokensService.seedData(); // If a public seed method existed
  });

  afterAll(async () => {
    // Clean up the test API key
    await duplicatedKeysService.deleteDuplicatedKey(testApiKey);

    // Rely on app.close() to handle database and Redis connection cleanup
    await app.close();
  });

  describe('/token/:symbol (GET)', () => {
    it('should return token info by symbol with valid API key', async () => {
      const apiKey = testApiKey;
      const symbol = testSymbol;

      const response = await request(app.getHttpServer())
        .get(`/token/${symbol}`)
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body).toHaveProperty('symbol', symbol.toUpperCase());
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price_usd');
      expect(response.body).toHaveProperty('market_cap_usd');
      // Add more specific assertions based on expected MockTokenDto structure
    });

    it('should return 401 if API key is missing', async () => {
      const symbol = testSymbol;

      const response = await request(app.getHttpServer())
        .get(`/token/${symbol}`)
        .expect(401); // Expect 401 at the HTTP level

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path');
    });

    it('should return 401 if API key is invalid', async () => {
      const apiKey = 'non-existent-api-key';
      const symbol = testSymbol;

      const response = await request(app.getHttpServer())
        .get(`/token/${symbol}`)
        .set('x-api-key', apiKey)
        .expect(401); // Still expect 401 at the HTTP level

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path');
    });

    it('should return 404 if token symbol not found', async () => {
      const apiKey = testApiKey;
      const symbol = 'NONEXISTENT'; // Use a symbol that won't be found

      const response = await request(app.getHttpServer())
        .get(`/token/${symbol}`)
        .set('x-api-key', apiKey)
        .expect(404); // Still expect 404 at the HTTP level

      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path');
    });

    it('should return 403 if API key is inactive', async () => {
      const inactiveApiKey = 'inactive-test-api-key';
      const symbol = testSymbol;

      // Create an inactive key for this test
      const createInactiveKeyDto: CreateDuplicatedAccessKeyDto = {
        apiKey: inactiveApiKey,
        rateLimitPerMinute: 1000,
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        isActive: false,
      };
      await duplicatedKeysService.upsertDuplicatedKey(createInactiveKeyDto);

      const response = await request(app.getHttpServer())
        .get(`/token/${symbol}`)
        .set('x-api-key', inactiveApiKey)
        .expect(403); // Expect 403 Forbidden

      expect(response.body).toHaveProperty('statusCode', 403);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path');

      // Clean up the inactive key
      await duplicatedKeysService.deleteDuplicatedKey(inactiveApiKey);
    });

    it('should return 403 if API key is expired', async () => {
      const expiredApiKey = 'expired-test-api-key';
      const symbol = testSymbol;

      // Create an expired key for this test
      const createExpiredKeyDto: CreateDuplicatedAccessKeyDto = {
        apiKey: expiredApiKey,
        rateLimitPerMinute: 1000,
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(), // Expired 1 year ago
        isActive: true,
      };
      await duplicatedKeysService.upsertDuplicatedKey(createExpiredKeyDto);

      const response = await request(app.getHttpServer())
        .get(`/token/${symbol}`)
        .set('x-api-key', expiredApiKey)
        .expect(403); // Expect 403 Forbidden

      expect(response.body).toHaveProperty('statusCode', 403);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path');

      // Clean up the expired key
      await duplicatedKeysService.deleteDuplicatedKey(expiredApiKey);
    });

    // Note: Rate limiting test would require more complex setup (e.g., mocking time or running multiple requests)
    // and is omitted for this basic setup.
  });
});