import { DataSource } from 'typeorm';
import { DuplicatedAccessKey } from '../../entities/duplicated-access-key.entity';
import { BaseRepository } from './base.repository';
import { CreateDuplicatedAccessKeyDto, UpdateDuplicatedAccessKeyDto } from '../../dtos/duplicated-access-key.dto';
export declare class DuplicatedAccessKeyRepository extends BaseRepository<DuplicatedAccessKey> {
    private dataSource;
    constructor(dataSource: DataSource);
    findOneByApiKey(apiKey: string): Promise<DuplicatedAccessKey | undefined>;
    upsertKey(createDto: CreateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey>;
    updateKey(apiKey: string, updateDto: UpdateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey>;
    deleteKey(apiKey: string): Promise<void>;
    setKeyActiveStatus(apiKey: string, isActive: boolean): Promise<DuplicatedAccessKey>;
}
