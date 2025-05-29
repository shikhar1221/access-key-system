import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT || '3000', 10),

  redis: {
    url: process.env.REDIS_URL || 'redis://redis_cache:6379',
  },
  DATABASE_URL: process.env.DATABASE_URL || '', 
  REDIS_URL: process.env.REDIS_URL || '', // Provide default empty string if undefined
}));