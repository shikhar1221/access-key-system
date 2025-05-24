import { HttpException } from '@nestjs/common';
export declare class TokenNotFoundException extends HttpException {
    constructor(symbol: string);
}
