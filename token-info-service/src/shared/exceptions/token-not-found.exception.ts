import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenNotFoundException extends HttpException {
  constructor(symbol: string) {
    super(`Token with symbol "${symbol}" not found`, HttpStatus.NOT_FOUND); // 404
  }
}