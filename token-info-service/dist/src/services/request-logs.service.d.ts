import { Repository } from 'typeorm';
import { RequestLog } from '../entities/request-log.entity';
import { CreateRequestLogDto } from '../dtos/request-log.dto';
export declare class RequestLogsService {
    private readonly requestLogRepository;
    constructor(requestLogRepository: Repository<RequestLog>);
    createLog(createLogDto: CreateRequestLogDto): Promise<RequestLog>;
    findAllByApiKey(apiKey: string): Promise<RequestLog[]>;
}
