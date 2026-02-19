import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config(); // Carga las variables de entorno desde el archivo .env

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['./src/**/*.entity.ts'],
  migrations: ['./src/database/migrations/*.ts'],
  synchronize: false,
});
