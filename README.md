# 🛠️ Développement local – Projet AWS V2

Ce projet contient un backend (Node.js + Express), un frontend (Vite + React) et une base de données PostgreSQL, le tout orchestré avec Docker.

### 2. Créer le fichier `.env`

Crée un fichier `.env` à la racine :

```env
POSTGRES_PORT=5434
BACKEND_PORT=3001
FRONTEND_PORT=4001
```

Et un fichier `backend/.env.local` :

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5434
```

### 3. Lancer la base de données, backend et frontend

```bash
docker compose up -d --build
```

### 4. Lancer le backend en local (optionnel)

```bash
cd backend
pnpm install
pnpm dev
```

> Le backend utilisera la base de données PostgreSQL lancée par Docker (via `localhost:5434`).

### 5. Lancer le frontend en local (optionnel)

```bash
cd frontend
pnpm install
pnpm dev
```
