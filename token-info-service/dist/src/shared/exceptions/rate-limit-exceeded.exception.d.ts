import { HttpException } from '@nestjs/common';
export declare class RateLimitExceededException extends HttpException {
    constructor(message?: string);
}
