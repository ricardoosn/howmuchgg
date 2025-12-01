# HowMuchGG Backend

Backend NestJS + MikroORM + Postgres para simulações rápidas.

## Requisitos
- Node 20+
- npm
- Docker + Docker Compose (para Postgres/Redis)

## Subindo o ambiente
1) `docker-compose up -d` (Postgres em localhost:5432, Redis em 6379, API exposta em 3000).
2) `cd backend`
3) `npm install`
4) Rodar migração:  
   `POSTGRES_HOST=localhost POSTGRES_PORT=5432 POSTGRES_USER=gameworth POSTGRES_PASSWORD=gameworth POSTGRES_DB=gameworth npx mikro-orm migration:up`
5) Rodar seed (dados de exemplo para todas as tabelas):  
   `POSTGRES_HOST=localhost POSTGRES_PORT=5432 POSTGRES_USER=gameworth POSTGRES_PASSWORD=gameworth POSTGRES_DB=gameworth npx mikro-orm seeder:run --class DatabaseSeeder`

## Desenvolvimento
- Servidor dev: `npm run start:dev`
- Lint: `npm run lint`
- Testes: `npm test`
- Swagger UI: `http://localhost:3000/api/docs`

## Rotas para teste (base http://localhost:3000/api)
- `GET /games` — lista jogos + métricas.
- `GET /games/:id` — detalhe do jogo + métricas.
- `POST /games/:id/submit` — envia preço de percepção `{ "price": number }` (requer sessão JWT).
- `GET /auth/steam` — inicia login Steam.
- `GET /auth/steam/callback` — callback Steam (retorna `{ ok, token }` e salva sessão).
- `GET /profile/me` — perfil + preços enviados (requer sessão JWT).

## DBeaver / cliente SQL
- Host: `localhost`
- Porta: `5432`
- Database: `gameworth`
- User: `gameworth`
- Password: `gameworth`
