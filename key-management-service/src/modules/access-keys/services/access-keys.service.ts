import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Ensure InjectRepository is imported
import { AccessKeyRepository } from '../repositories/access-key.repository';
import { AccessKey } from '../entities/access-key.entity';
import { CreateAccessKeyDto } from '../dto/create-access-key.dto';
import { UpdateAccessKeyDto } from '../dto/update-access-key.dto';
import { AccessKeyPublisherService } from './access-key-publisher.service';
import { v4 as uuidv4 } from 'uuid';
import { AccessKeyEventType } from '../../../shared/access-key-event'; // Add this import

@Injectable()
export class AccessKeysService {
  private readonly logger = new Logger(AccessKeysService.name);
  constructor(
    @InjectRepository(AccessKeyRepository) // Inject using @InjectRepository for TypeORM 0.2.x custom repository
    private readonly accessKeyRepository: AccessKeyRepository,
    private readonly accessKeyPublisherService: AccessKeyPublisherService,
  ) {}

  async createKey(createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    this.logger.log('Creating new access key.');
    const apiKey = uuidv4();
    this.logger.log(`Generated API Key: ${apiKey}`);
    const newKeyData = {
      ...createAccessKeyDto,
      apiKey,
      expiresAt: new Date(createAccessKeyDto.expiresAt),
    };
    this.logger.log(`New access key data prepared: ${JSON.stringify(newKeyData)}`);
    const savedKey = await this.accessKeyRepository.createAccessKeyEntry(newKeyData);
    this.logger.log(`Access key created successfully with API Key: ${savedKey.apiKey}`);
    await this.accessKeyPublisherService.publishEvent(AccessKeyEventType.CREATED, savedKey);
    return savedKey;
  }

  async listKeys(): Promise<AccessKey[]> {
    this.logger.log('Listing all access keys.');
    return this.accessKeyRepository.find();
  }

  async findOneByApiKey(apiKey: string): Promise<AccessKey> {
    this.logger.log(`Finding access key with API Key: ${apiKey}`);
    const key = await this.accessKeyRepository.findOne({ where: { apiKey } });
    if (!key) {
      this.logger.warn(`Access key with API Key "${apiKey}" not found.`);
      throw new NotFoundException(`Access key with API Key "${apiKey}" not found`);
    }
    this.logger.log(`Access key found with API Key: ${apiKey}`);
    return key;
  }

  async updateKey(apiKey: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    this.logger.log(`Updating access key with API Key: ${apiKey}`);
    const key = await this.findOneByApiKey(apiKey);
    // Directly update the key object, handling type conversion for expiresAt
    if (updateAccessKeyDto.expiresAt) {
      key.expiresAt = new Date(updateAccessKeyDto.expiresAt);
      // Remove expiresAt from updateAccessKeyDto to avoid type conflict with Object.assign if it's still a string there
      const { expiresAt, ...restOfDto } = updateAccessKeyDto;
      Object.assign(key, restOfDto);
    } else {
      Object.assign(key, updateAccessKeyDto);
    }
    const updatedKey = await this.accessKeyRepository.save(key);
    this.logger.log(`Access key updated successfully with API Key: ${updatedKey.apiKey}`);
    await this.accessKeyPublisherService.publishEvent(AccessKeyEventType.UPDATED, updatedKey);
    return updatedKey;
  }

  async deleteKey(apiKey: string): Promise<void> {
    this.logger.log(`Deleting access key with API Key: ${apiKey}`);
    const key = await this.findOneByApiKey(apiKey);
    await this.accessKeyRepository.remove(key);
    this.logger.log(`Access key deleted successfully with API Key: ${apiKey}`);
    await this.accessKeyPublisherService.publishEvent(AccessKeyEventType.DELETED, { apiKey: key.apiKey, id: key.id }); // Pass relevant info
  }

  async disableKey(apiKey: string): Promise<AccessKey> {
    this.logger.log(`Disabling access key with API Key: ${apiKey}`);
    const key = await this.findOneByApiKey(apiKey);
    key.isActive = false;
    const disabledKey = await this.accessKeyRepository.save(key);
    this.logger.log(`Access key disabled successfully with API Key: ${disabledKey.apiKey}`);
    await this.accessKeyPublisherService.publishEvent(AccessKeyEventType.DISABLED, disabledKey);
    return disabledKey;
  }

  async enableKey(apiKey: string): Promise<AccessKey> {
    this.logger.log(`Enabling access key with API Key: ${apiKey}`);
    const key = await this.findOneByApiKey(apiKey);
    key.isActive = true;
    const enabledKey = await this.accessKeyRepository.save(key);
    this.logger.log(`Access key enabled successfully with API Key: ${enabledKey.apiKey}`);
    await this.accessKeyPublisherService.publishEvent(AccessKeyEventType.ENABLED, enabledKey);
    return enabledKey;
  }

  async getUserPlan(apiKey: string): Promise<AccessKey> {
    this.logger.log(`Getting user plan for API Key: ${apiKey}`);
    // In a real application, this might involve more complex logic 
    // to determine the plan based on the key or associated user.
    // For now, it just returns the key details if active.
    const key = await this.findOneByApiKey(apiKey);
    if (!key.isActive) {
        this.logger.warn(`Access key with API Key "${apiKey}" is inactive.`);
        throw new NotFoundException(`Access key with API Key "${apiKey}" is inactive.`);
    }
    this.logger.log(`User plan retrieved successfully for API Key: ${apiKey}`);
    return key;
  }
}