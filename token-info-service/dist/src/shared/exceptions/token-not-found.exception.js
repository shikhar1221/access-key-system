"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class TokenNotFoundException extends common_1.HttpException {
    constructor(symbol) {
        super(`Token with symbol "${symbol}" not found`, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.TokenNotFoundException = TokenNotFoundException;
