import { Logger } from '@nestjs/common';
import { AccessKeyRepository } from '../repositories/access-key.repository';
import { AccessKey } from '../entities/access-key.entity';
import { CreateAccessKeyDto } from '../dto/create-access-key.dto';
import { UpdateAccessKeyDto } from '../dto/update-access-key.dto';
import { AccessKeyPublisherService } from './access-key-publisher.service';
export declare class AccessKeysService {
    private readonly accessKeyRepository;
    private readonly accessKeyPublisherService;
    private readonly logger;
    constructor(accessKeyRepository: AccessKeyRepository, accessKeyPublisherService: AccessKeyPublisherService, logger: Logger);
    createKey(createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey>;
    listKeys(): Promise<AccessKey[]>;
    findOneByApiKey(apiKey: string): Promise<AccessKey>;
    updateKey(apiKey: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey>;
    deleteKey(apiKey: string): Promise<void>;
    disableKey(apiKey: string): Promise<AccessKey>;
    enableKey(apiKey: string): Promise<AccessKey>;
    getUserPlan(apiKey: string): Promise<AccessKey>;
}
