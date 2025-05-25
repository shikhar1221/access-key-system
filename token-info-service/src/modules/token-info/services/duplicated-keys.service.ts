import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicatedAccessKey } from '../../../entities/duplicated-access-key.entity';
import { CreateDuplicatedAccessKeyDto, UpdateDuplicatedAccessKeyDto } from '../dtos/duplicated-access-key.dto';
import { DuplicatedAccessKeyRepository } from '../../../shared/repositories/duplicated-access-key.repository'; // Import the custom repository

@Injectable()
export class DuplicatedKeysService {
  constructor(
    @InjectRepository(DuplicatedAccessKeyRepository) // Inject the custom repository class
    private readonly duplicatedKeysRepository: DuplicatedAccessKeyRepository,
    // private dataSource: DataSource, // Remove DataSource injection
  ) {
  }

  async findOne(apiKey: string): Promise<DuplicatedAccessKey | undefined> {
    return this.duplicatedKeysRepository.findOneByApiKey(apiKey); // Use custom repository method
  }

  async upsertDuplicatedKey(createDto: CreateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey> {
    return this.duplicatedKeysRepository.upsertKey(createDto); // Use custom repository method
  }

  async updateDuplicatedKey(apiKey: string, updateDto: UpdateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey> {
    return this.duplicatedKeysRepository.updateKey(apiKey, updateDto); // Use custom repository method
  }

  async deleteDuplicatedKey(apiKey: string): Promise<void> {
    return this.duplicatedKeysRepository.deleteKey(apiKey); // Use custom repository method
  }

  // Method to be called by AccessKeySubscriberService when a key is disabled/enabled
  async setKeyActiveStatus(apiKey: string, isActive: boolean): Promise<DuplicatedAccessKey> {
    return this.duplicatedKeysRepository.setKeyActiveStatus(apiKey, isActive); // Use custom repository method
  }
}