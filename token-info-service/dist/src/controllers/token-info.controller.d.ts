import { TokenInfoService } from '../services/token-info.service';
import { MockTokenDto } from '../dtos/mock-token.dto';
export declare class TokenInfoController {
    private readonly tokenInfoService;
    constructor(tokenInfoService: TokenInfoService);
    getTokenInfo(apiKey: string, symbol: string): Promise<MockTokenDto>;
}
