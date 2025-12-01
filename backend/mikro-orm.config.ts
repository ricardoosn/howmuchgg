import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  dbName: process.env.POSTGRES_DB ?? 'gameworth',
  user: process.env.POSTGRES_USER ?? 'gameworth',
  password: process.env.POSTGRES_PASSWORD ?? 'gameworth',
  host: process.env.POSTGRES_HOST ?? 'postgres',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  tsNode: true,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './src/seeders',
  },
});
