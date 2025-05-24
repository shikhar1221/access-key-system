import { Repository, DataSource } from 'typeorm';
import { AccessKey } from '../entities/access-key.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable() // Use EntityRepository for TypeORM 0.2.x
export class AccessKeyRepository extends Repository<AccessKey> {
  private readonly logger = new Logger(AccessKeyRepository.name);
  constructor(private readonly dataSource: DataSource) {
    super(AccessKey, dataSource.createEntityManager());
  }
  // Custom repository methods can be added here if needed
  // For example:
  // async findByUserId(userId: string): Promise<AccessKey[]> {
  //   return this.find({ where: { userId } });
  // }
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      // isInitialized checks if the DataSource has been initialized and connected
      const isConnected = this.dataSource.isInitialized;
      if (isConnected) {
        this.logger.log('Database connection is active.');
        // You could also run a simple query to test the connection further
        // await this.dataSource.query('SELECT 1');
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
// No explicit constructor needed for TypeORM 0.2.x custom repositories
// when extending Repository. TypeORM handles the injection.

// Note: If this custom repository is to be used, it needs to be provided
// in the AccessKeysModule providers array and TypeOrmModule.forFeature should list only the entity [AccessKey].
// For example, in access-keys.module.ts:
// providers: [AccessKeysService, AccessKeyPublisherService, AccessKeyRepository]
// TypeOrmModule.forFeature([AccessKey])
// And in AccessKeysService, inject with @Inject(AccessKeyRepository) private readonly accessKeyRepository: AccessKeyRepository;