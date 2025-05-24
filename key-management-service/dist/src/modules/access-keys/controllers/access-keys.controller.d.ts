import { AccessKeysService } from '../services/access-keys.service';
import { CreateAccessKeyDto } from '../dto/create-access-key.dto';
import { UpdateAccessKeyDto } from '../dto/update-access-key.dto';
import { AccessKey } from '../entities/access-key.entity';
export declare class AccessKeysController {
    private readonly accessKeysService;
    private readonly logger;
    constructor(accessKeysService: AccessKeysService);
    createKey(createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey>;
    listKeys(): Promise<AccessKey[]>;
    updateKey(apiKey: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey>;
    deleteKey(apiKey: string): Promise<void>;
    getUserPlan(apiKey: string): Promise<AccessKey>;
    disableKey(apiKey: string): Promise<AccessKey>;
}
