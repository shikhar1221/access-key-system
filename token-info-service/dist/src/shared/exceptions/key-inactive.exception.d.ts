import { HttpException } from '@nestjs/common';
export declare class KeyInactiveException extends HttpException {
    constructor(message?: string);
}
