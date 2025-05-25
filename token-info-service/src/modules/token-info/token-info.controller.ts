import { Controller, Get, Param, Headers, UseFilters, ParseUUIDPipe } from '@nestjs/common';
import { TokenInfoService } from './services/token-info.service';
import { AllExceptionsFilter } from '../../shared/filters/all-exceptions.filter'; // Assuming this is the global filter
import { MockTokenDto } from './dtos/mock-token.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('token-info')
@Controller('token')
@UseFilters(new AllExceptionsFilter()) // Apply filter at controller level if not globally applied or for specificity
export class TokenInfoController {
  constructor(private readonly tokenInfoService: TokenInfoService) {}

  @Get(':symbol')
  @ApiOperation({ summary: 'Get token information by symbol' })
  @ApiResponse({ status: 200, description: 'Token information retrieved successfully.', type: MockTokenDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Token not found.' })
  async getTokenInfo(
    @Headers('x-api-key') apiKey: string,
    @Param('symbol') symbol: string,
  ): Promise<MockTokenDto> {
    const requestPath = `/token/${symbol}`;
    const tokenData = await this.tokenInfoService.getTokenInfo(apiKey, symbol, requestPath);
    
    return {
        symbol: tokenData.symbol,
        name: tokenData.name,
        price_usd: tokenData.price_usd,
        market_cap_usd: tokenData.market_cap_usd,
    };
  }
}