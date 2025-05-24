"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInfoController = void 0;
const common_1 = require("@nestjs/common");
const token_info_service_1 = require("../services/token-info.service");
const all_exceptions_filter_1 = require("../shared/filters/all-exceptions.filter");
const mock_token_dto_1 = require("../dtos/mock-token.dto");
const swagger_1 = require("@nestjs/swagger");
let TokenInfoController = class TokenInfoController {
    constructor(tokenInfoService) {
        this.tokenInfoService = tokenInfoService;
    }
    async getTokenInfo(apiKey, symbol) {
        const requestPath = `/token/${symbol}`;
        const tokenData = await this.tokenInfoService.getTokenInfo(apiKey, symbol, requestPath);
        return {
            symbol: tokenData.symbol,
            name: tokenData.name,
            price_usd: tokenData.price_usd,
            market_cap_usd: tokenData.market_cap_usd,
        };
    }
};
__decorate([
    (0, common_1.Get)(':symbol'),
    (0, swagger_1.ApiOperation)({ summary: 'Get token information by symbol' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token information retrieved successfully.', type: mock_token_dto_1.MockTokenDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Token not found.' }),
    __param(0, (0, common_1.Headers)('x-api-key')),
    __param(1, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TokenInfoController.prototype, "getTokenInfo", null);
TokenInfoController = __decorate([
    (0, swagger_1.ApiTags)('token-info'),
    (0, common_1.Controller)('token'),
    (0, common_1.UseFilters)(new all_exceptions_filter_1.AllExceptionsFilter()),
    __metadata("design:paramtypes", [token_info_service_1.TokenInfoService])
], TokenInfoController);
exports.TokenInfoController = TokenInfoController;
