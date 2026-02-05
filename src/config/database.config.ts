import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  url: process.env.DATABASE_URL,
}));
