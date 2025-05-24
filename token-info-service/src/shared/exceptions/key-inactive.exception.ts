import { HttpException, HttpStatus } from '@nestjs/common';

export class KeyInactiveException extends HttpException {
  constructor(message = 'API Key is inactive') {
    super(message, HttpStatus.FORBIDDEN); // 403
  }
}