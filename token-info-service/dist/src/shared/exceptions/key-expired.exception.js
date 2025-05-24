"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyExpiredException = void 0;
const common_1 = require("@nestjs/common");
class KeyExpiredException extends common_1.HttpException {
    constructor(message = 'API Key has expired') {
        super(message, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.KeyExpiredException = KeyExpiredException;
