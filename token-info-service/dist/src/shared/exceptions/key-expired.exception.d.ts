import { HttpException } from '@nestjs/common';
export declare class KeyExpiredException extends HttpException {
    constructor(message?: string);
}
