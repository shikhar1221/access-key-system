import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_TYPE: Joi.string().default('postgres'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('postgres'),
  DATABASE_NAME: Joi.string().default('key_management_db'),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(true),
  DATABASE_POOL_SIZE: Joi.number().default(20),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  DATABASE_URL: Joi.string().optional(), 
});