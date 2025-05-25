import { DataSource } from 'typeorm'; // DataSource is for TypeORM 0.3.x+
import { config } from 'dotenv';
import { join } from 'path';

config(); // Load .env file

export default new DataSource({
  type: 'postgres' as 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '**', '/**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: process.env.NODE_ENV === 'development', // Be cautious with synchronize in production
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});