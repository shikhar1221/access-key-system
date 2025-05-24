import { Repository, DataSource } from 'typeorm';
import { AccessKey } from '../entities/access-key.entity';
export declare class AccessKeyRepository extends Repository<AccessKey> {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    checkDatabaseConnection(): Promise<boolean>;
    createAccessKeyEntry(keyData: Partial<AccessKey>): Promise<AccessKey>;
}
