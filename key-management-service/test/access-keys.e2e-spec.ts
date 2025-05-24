import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import 'pg'; // Explicitly import pg
import * as request from 'supertest';
import { AppModule } from './../src/modules/app/app.module';
import { CreateAccessKeyDto } from 'src/modules/access-keys/dto/create-access-key.dto';
import { AccessKey } from './../src/modules/access-keys/entities/access-key.entity';
import { Repository, DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from '../src/modules/redis/redis.service';

describe('AccessKeysController (e2e)', () => {
  let app: INestApplication;
  let accessKeyRepository: Repository<AccessKey>;
  let dataSource: DataSource;
  let redisService: RedisService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0); // Listen on a random available port

    accessKeyRepository = moduleFixture.get<Repository<AccessKey>>(getRepositoryToken(AccessKey));
    dataSource = moduleFixture.get<DataSource>(DataSource);
    redisService = moduleFixture.get<RedisService>(RedisService);

    // Explicitly drop and synchronize the database schema for a clean test environment
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    // No need to truncate, drop/synchronize handles cleanup
    // await accessKeyRepository.query('TRUNCATE TABLE access_key RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    // Add a small delay to allow any pending database operations to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (redisService) {
      // Explicitly close the Redis connection
      // The method name might vary depending on the Redis client library used in RedisService
      // Common methods are 'quit()' or 'disconnect()'
      try {
        // Assuming a 'quit' method exists on the underlying Redis client
        await (redisService as any).getClient().quit();
      } catch (error) {
        console.error('Error closing Redis connection:', error);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    await dataSource.destroy();
    await app.close();
  }, 15000); // Increase timeout to 15 seconds

  describe('/access-keys (POST)', () => {
    it('should create an access key successfully', async () => {
      const createAccessKeyDto: CreateAccessKeyDto = {
        userId: 'test-key-e2e',
        rateLimitPerMinute: 60,
        expiresAt: '2025-12-31T23:59:59.000Z'
      };

      const response = await request(app.getHttpServer())
        .post('/admin/keys')
        .send(createAccessKeyDto)
        .expect(201);

      expect((response.body as AccessKey)).toHaveProperty('id');
      expect((response.body as AccessKey).rateLimitPerMinute).toBe(createAccessKeyDto.rateLimitPerMinute);

      // Verify the key exists in the database
      const createdKey = await accessKeyRepository.findOne({ where: { id: (response.body as AccessKey).id } });
      expect(createdKey).toBeDefined();
      expect(createdKey?.rateLimitPerMinute).toBe(createAccessKeyDto.rateLimitPerMinute);
    });

    it('should return 400 if name is missing', async () => {
      const createAccessKeyDto: any = {
        rateLimitPerMinute: 60,
      };

      await request(app.getHttpServer())
        .post('/admin/keys')
        .send(createAccessKeyDto)
        .expect(400);
    });

    // Add more validation tests here
  });

  describe('/keys/my-plan (GET)', () => {
    it('should return an access key using X-API-Key header', async () => {
      const createAccessKeyDto: CreateAccessKeyDto = {
        userId: 'find-key-e2e',
        rateLimitPerMinute: 120,
        expiresAt: '2025-12-31T23:59:59.000Z'
      };

      // Create the key using the controller endpoint to ensure apiKey is generated
      const createResponse = await request(app.getHttpServer())
        .post('/admin/keys')
        .send(createAccessKeyDto)
        .expect(201);

      const createdKey = createResponse.body as AccessKey;
      const apiKey = createdKey.apiKey;

      const response = await request(app.getHttpServer())
        .get('/keys/my-plan')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect((response.body as AccessKey)).toHaveProperty('id', createdKey.id);
      expect((response.body as AccessKey)).toHaveProperty('apiKey', createdKey.apiKey);
      expect((response.body as AccessKey).rateLimitPerMinute).toBe(createdKey.rateLimitPerMinute);
    });

    it('should return 401 if X-API-Key header is missing', async () => {
      await request(app.getHttpServer())
        .get('/keys/my-plan')
        .expect(401);
    });

    it('should return 404 if access key not found or inactive', async () => {
      const nonExistentApiKey = 'non-existent-api-key';

      await request(app.getHttpServer())
        .get('/keys/my-plan')
        .set('X-API-Key', nonExistentApiKey)
        .expect(404);
    });
  });

  // Add tests for GET /access-keys, PATCH /access-keys/:id, DELETE /access-keys/:id

  // Note: Testing rate limiting requires a more complex setup, potentially involving mocking or a dedicated test environment.
  // A basic approach might involve making multiple requests quickly and asserting a 429 status code.
});