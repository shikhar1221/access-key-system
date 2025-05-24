import { HttpException, HttpStatus } from '@nestjs/common';

export class KeyExpiredException extends HttpException {
  constructor(message = 'API Key has expired') {
    super(message, HttpStatus.FORBIDDEN); // 403
  }
}