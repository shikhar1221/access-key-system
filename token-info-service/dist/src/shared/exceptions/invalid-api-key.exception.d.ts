import { HttpException } from '@nestjs/common';
export declare class InvalidApiKeyException extends HttpException {
    constructor(message?: string);
}
