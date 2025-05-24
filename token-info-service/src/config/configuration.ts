import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
}));