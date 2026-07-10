# CNA - Cadastro e Sorteio

Projeto full-stack com **NestJS + Prisma + PostgreSQL** (backend) e **Next.js** (frontend).

## Estrutura

```
cna-project/
├── backend/    (NestJS + Prisma)
└── frontend/   (Next.js)
```

## Funcionalidades

- Cadastro com: Nome completo, WhatsApp (com máscara), E-mail (opcional), Preferência de idioma (Inglês/Espanhol)
- Página `/sorteio` que sorteia aleatoriamente um nome cadastrado no banco
- Banco de dados PostgreSQL via Prisma ORM

---

## 1. Pré-requisitos

- Node.js 18+
- PostgreSQL rodando (local, Docker ou serviço na nuvem)

## 2. Configurar o banco de dados (opcional via Docker)

Se não tiver Postgres instalado, você pode subir um rapidamente:

```bash
docker run --name cna-postgres -e POSTGRES_PASSWORD=0805 -e POSTGRES_USER=gaby -e POSTGRES_DB=cna_db -p 5432:5432 -d postgres:16
```

## 3. Backend (NestJS + Prisma)

```bash
cd backend
cp .env.example .env
# edite o .env com a URL correta do seu Postgres
npm install
npx prisma migrate dev --name init
npm run start:dev
```

O backend sobe em `http://localhost:3001/api`.

### Endpoints principais

| Método | Rota                        | Descrição                              |
|--------|-----------------------------|-----------------------------------------|
| POST   | /api/registrations          | Cria um cadastro                        |
| GET    | /api/registrations          | Lista todos os cadastros                |
| GET    | /api/registrations/count    | Retorna total de cadastros              |
| GET    | /api/raffle/participants    | Lista participantes do sorteio          |
| POST   | /api/raffle/draw            | Realiza o sorteio (retorna o vencedor)  |
| GET    | /api/raffle/history         | Histórico de sorteios já realizados     |

## 4. Frontend (Next.js)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

O frontend sobe em `http://localhost:3000`.

- `http://localhost:3000/` → página de cadastro
- `http://localhost:3000/sorteio` → página do sorteio (compartilhe esta URL)

## 5. Deploy

- Backend: pode ser publicado em qualquer serviço Node (Railway, Render, Fly.io, VPS) — lembre de configurar `DATABASE_URL` e `FRONTEND_URL`.
- Frontend: pode ser publicado na Vercel — configure `NEXT_PUBLIC_API_URL` apontando para a URL pública do backend.
- Depois do deploy, a URL pública do sorteio será algo como: `https://seu-dominio.com/sorteio`

## Observações

- O sorteio, por padrão, **não repete** quem já ganhou (`onlyNewWinners = true`). Para permitir repetição, chame `POST /api/raffle/draw?allowRepeat=true`.
- O WhatsApp é validado no formato brasileiro `(99) 99999-9999` tanto no front (máscara) quanto no back (regex), e é único no banco (não permite duplicado).
