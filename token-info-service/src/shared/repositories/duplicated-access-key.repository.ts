import { DataSource } from 'typeorm';
import { DuplicatedAccessKey } from '../../entities/duplicated-access-key.entity';
import { BaseRepository } from './base.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDuplicatedAccessKeyDto, UpdateDuplicatedAccessKeyDto } from '../../modules/token-info/dtos/duplicated-access-key.dto';

@Injectable()
export class DuplicatedAccessKeyRepository extends BaseRepository<DuplicatedAccessKey> {
  constructor(private dataSource: DataSource) {
    super(DuplicatedAccessKey, dataSource.createEntityManager());
  }

  async findOneByApiKey(apiKey: string): Promise<DuplicatedAccessKey | undefined> {
    return this.findOne({ where: { apiKey } });
  }

  async upsertKey(createDto: CreateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let key = await queryRunner.manager.findOne(DuplicatedAccessKey, { where: { apiKey: createDto.apiKey } });

      if (key) {
        // Update existing key
        key = queryRunner.manager.merge(DuplicatedAccessKey, key, createDto);
      } else {
        // Create new key
        key = queryRunner.manager.create(DuplicatedAccessKey, createDto);
        console.log(key);
      }

      const savedKey = await queryRunner.manager.save(key);

      await queryRunner.commitTransaction();
      return savedKey;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err; // Re-throw the error
    } finally {
      await queryRunner.release();
    }
  }

  async updateKey(apiKey: string, updateDto: UpdateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey> {
    const key = await this.findOneByApiKey(apiKey);
    if (!key) {
      throw new NotFoundException(`DuplicatedAccessKey with API key "${apiKey}" not found`);
    }
    const updatedKey = this.merge(key, updateDto);
    return this.save(updatedKey);
  }

  async deleteKey(apiKey: string): Promise<void> {
    const result = await this.delete({ apiKey });
    if (result.affected === 0) {
      throw new NotFoundException(`DuplicatedAccessKey with API key "${apiKey}" not found for deletion`);
    }
  }

  async setKeyActiveStatus(apiKey: string, isActive: boolean): Promise<DuplicatedAccessKey> {
    const key = await this.findOneByApiKey(apiKey);
    if (!key) {
      throw new NotFoundException(`DuplicatedAccessKey with API key "${apiKey}" not found to update active status.`);
    }
    key.isActive = isActive;
    return this.save(key);
  }
}