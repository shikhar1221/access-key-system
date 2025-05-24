import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidApiKeyException extends HttpException {
  constructor(message = 'Invalid API Key') {
    super(message, HttpStatus.UNAUTHORIZED); // 401
  }
}