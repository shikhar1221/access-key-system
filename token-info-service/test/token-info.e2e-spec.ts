import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/modules/app.module';
import { CreateTokenInfoDto } from './../src/modules/token-info/dtos/create-token-info.dto';
import { TokenInfo } from './../src/modules/token-info/entities/token-info.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TokenInfoController (e2e)', () => {
  let app: INestApplication;
  let tokenInfoRepository: Repository<TokenInfo>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    tokenInfoRepository = moduleFixture.get<Repository<TokenInfo>>(getRepositoryToken(TokenInfo));

    // Clear the database before running tests
    await tokenInfoRepository.query('TRUNCATE TABLE token_info RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/token-info (POST)', () => {
    it('should create token info successfully', async () => {
      const createTokenInfoDto: CreateTokenInfoDto = {
        token: 'test-token-e2e',
        info: { userId: 'user-e2e-1' },
      };

      const response = await request(app.getHttpServer())
        .post('/token-info')
        .send(createTokenInfoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.token).toBe(createTokenInfoDto.token);
      expect(response.body.info).toEqual(createTokenInfoDto.info);

      // Verify the token info exists in the database
      const createdTokenInfo = await tokenInfoRepository.findOne({ where: { id: response.body.id } });
      expect(createdTokenInfo).toBeDefined();
      expect(createdTokenInfo?.token).toBe(createTokenInfoDto.token);
    });

    it('should return 400 if token is missing', async () => {
      const createTokenInfoDto: any = {
        info: { userId: 'user-e2e-2' },
      };

      await request(app.getHttpServer())
        .post('/token-info')
        .send(createTokenInfoDto)
        .expect(400);
    });

    // Add more validation tests here
  });

  describe('/token-info/:token (GET)', () => {
    it('should return token info by token', async () => {
      const createTokenInfoDto: CreateTokenInfoDto = {
        token: 'find-token-e2e',
        info: { userId: 'user-e2e-3' },
      };
      const createdTokenInfo = await tokenInfoRepository.save(tokenInfoRepository.create(createTokenInfoDto));

      const response = await request(app.getHttpServer())
        .get(`/token-info/${createdTokenInfo.token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTokenInfo.id);
      expect(response.body.token).toBe(createdTokenInfo.token);
      expect(response.body.info).toEqual(createdTokenInfo.info);
    });

    it('should return 404 if token info not found', async () => {
      const nonExistentToken = 'non-existent-token';

      await request(app.getHttpServer())
        .get(`/token-info/${nonExistentToken}`)
        .expect(404);
    });
  });

  describe('/token-info/:token (PATCH)', () => {
    it('should update token info by token', async () => {
      const createTokenInfoDto: CreateTokenInfoDto = {
        token: 'update-token-e2e',
        info: { userId: 'user-e2e-4' },
      };
      const createdTokenInfo = await tokenInfoRepository.save(tokenInfoRepository.create(createTokenInfoDto));

      const updateTokenInfoDto = { info: { userId: 'user-e2e-4-updated' } };

      const response = await request(app.getHttpServer())
        .patch(`/token-info/${createdTokenInfo.token}`)
        .send(updateTokenInfoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTokenInfo.id);
      expect(response.body.token).toBe(createdTokenInfo.token);
      expect(response.body.info).toEqual(updateTokenInfoDto.info);

      // Verify the token info is updated in the database
      const updatedTokenInfo = await tokenInfoRepository.findOne({ where: { token: createdTokenInfo.token } });
      expect(updatedTokenInfo).toBeDefined();
      expect(updatedTokenInfo?.info).toEqual(updateTokenInfoDto.info);
    });

    it('should return 404 if token info not found for update', async () => {
      const nonExistentToken = 'non-existent-token-for-update';
      const updateTokenInfoDto = { info: { userId: 'user-e2e-update-fail' } };

      await request(app.getHttpServer())
        .patch(`/token-info/${nonExistentToken}`)
        .send(updateTokenInfoDto)
        .expect(404);
    });
  });

  describe('/token-info/:token (DELETE)', () => {
    it('should delete token info by token', async () => {
      const createTokenInfoDto: CreateTokenInfoDto = {
        token: 'delete-token-e2e',
        info: { userId: 'user-e2e-5' },
      };
      const createdTokenInfo = await tokenInfoRepository.save(tokenInfoRepository.create(createTokenInfoDto));

      await request(app.getHttpServer())
        .delete(`/token-info/${createdTokenInfo.token}`)
        .expect(200);

      // Verify the token info is deleted from the database
      const deletedTokenInfo = await tokenInfoRepository.findOne({ where: { token: createdTokenInfo.token } });
      expect(deletedTokenInfo).toBeNull();
    });

    it('should return 404 if token info not found for deletion', async () => {
      const nonExistentToken = 'non-existent-token-for-delete';

      await request(app.getHttpServer())
        .delete(`/token-info/${nonExistentToken}`)
        .expect(404);
    });
  });
});