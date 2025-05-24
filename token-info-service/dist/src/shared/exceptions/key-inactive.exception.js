"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyInactiveException = void 0;
const common_1 = require("@nestjs/common");
class KeyInactiveException extends common_1.HttpException {
    constructor(message = 'API Key is inactive') {
        super(message, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.KeyInactiveException = KeyInactiveException;
