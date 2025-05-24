import { DataSource } from 'typeorm'; // DataSource is for TypeORM 0.3.x+
import { config } from 'dotenv';
import { join } from 'path';

config(); // Load .env file

// For TypeORM 0.2.x, the data source for CLI is typically configured via ormconfig.js or ormconfig.json
// or by passing options directly to the CLI.
// Commenting out DataSource instantiation to avoid build errors with TypeORM 0.2.x.

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

// Placeholder for TypeORM 0.2.x CLI configuration if needed.
// This might involve creating an ormconfig.js or similar.
// For now, ensuring this file doesn't cause a build error.