import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    name: process.env.DATABASE_NAME || 'key_management_db',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  DATABASE_URL: process.env.DATABASE_URL || '', 
  REDIS_URL: process.env.REDIS_URL || '', // Provide default empty string if undefined
}));