import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  redis: {
    url: process.env.REDIS_URL || 'redis://redis_cache:6379',
  },
  DATABASE_URL: process.env.DATABASE_URL || '',
}));