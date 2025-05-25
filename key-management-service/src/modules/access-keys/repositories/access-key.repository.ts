import { Repository, DataSource } from 'typeorm';
import { AccessKey } from '../entities/access-key.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccessKeyRepository extends Repository<AccessKey> {
  private readonly logger = new Logger(AccessKeyRepository.name);
  constructor(private readonly dataSource: DataSource) {
    super(AccessKey, dataSource.createEntityManager());
  }
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      // isInitialized checks if the DataSource has been initialized and connected
      const isConnected = this.dataSource.isInitialized;
      if (isConnected) {
        this.logger.log('Database connection is active.');
        return true;
      } else {
        this.logger.error('Database connection is not initialized.');
        return false;
      }
    } catch (error) {
      this.logger.error(`Database connection check failed: ${error.message}`);
      return false;
    }
  }

  async createAccessKeyEntry(keyData: Partial<AccessKey>): Promise<AccessKey> {
    this.logger.log('Creating new access key entry in repository.');

    this.checkDatabaseConnection();
    const newKey = this.create(keyData);
    this.logger.log(`Created entity object: ${JSON.stringify(newKey)}`);
    const savedKey = await this.save(newKey);
    this.logger.log(`Saved access key entry with ID: ${savedKey.id}`);
    return savedKey;
  }
}