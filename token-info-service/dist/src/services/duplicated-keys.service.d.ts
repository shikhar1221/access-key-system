import { DuplicatedAccessKey } from '../entities/duplicated-access-key.entity';
import { CreateDuplicatedAccessKeyDto, UpdateDuplicatedAccessKeyDto } from '../dtos/duplicated-access-key.dto';
import { DuplicatedAccessKeyRepository } from '../shared/repositories/duplicated-access-key.repository';
export declare class DuplicatedKeysService {
    private readonly duplicatedKeysRepository;
    constructor(duplicatedKeysRepository: DuplicatedAccessKeyRepository);
    findOne(apiKey: string): Promise<DuplicatedAccessKey | undefined>;
    upsertDuplicatedKey(createDto: CreateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey>;
    updateDuplicatedKey(apiKey: string, updateDto: UpdateDuplicatedAccessKeyDto): Promise<DuplicatedAccessKey>;
    deleteDuplicatedKey(apiKey: string): Promise<void>;
    setKeyActiveStatus(apiKey: string, isActive: boolean): Promise<DuplicatedAccessKey>;
}
