"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitExceededException = void 0;
const common_1 = require("@nestjs/common");
class RateLimitExceededException extends common_1.HttpException {
    constructor(message = 'Rate limit exceeded') {
        super(message, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
}
exports.RateLimitExceededException = RateLimitExceededException;
