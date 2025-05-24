"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidApiKeyException = void 0;
const common_1 = require("@nestjs/common");
class InvalidApiKeyException extends common_1.HttpException {
    constructor(message = 'Invalid API Key') {
        super(message, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.InvalidApiKeyException = InvalidApiKeyException;
