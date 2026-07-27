# Setup local — EcoTurismo

Guía para clonar, configurar e iniciar el proyecto en tu máquina.

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm
- PostgreSQL 14+ (probado con 17)
- Cuenta Cloudinary (para subir imágenes de alojamientos)
- (Opcional) Redis, solo si activas módulos que lo usen

## Estructura del proyecto

```text
ECOTURISMO/
├── BACKEND/                     # API REST (Express + PostgreSQL)
│   ├── app.js                   # Express app + Swagger UI
│   ├── server.js                # Arranque del servidor
│   ├── .env.example             # Plantilla de variables (copiar a .env)
│   ├── migrations/              # SQL de evolución del esquema
│   │   ├── 001_unidad_to_alojamiento.sql
│   │   ├── 002_servicios_e_iconos.sql
│   │   └── 003_mensajes.sql
│   ├── src/
│   │   ├── config/              # DB, Cloudinary, Redis, Swagger
│   │   ├── middlewares/         # JWT, roles, validación, upload, errores
│   │   ├── modules/             # Dominios (auth, alojamientos, …)
│   │   ├── routes/              # Montaje de /api/*
│   │   └── utils/
│   └── tests/
├── FRONTEND/                    # SPA React + Vite
│   ├── .env.example
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── components/          # UI reutilizable (Alojamiento, layout, chat…)
│       ├── data/                # Datos estáticos (municipios Colombia)
│       ├── pages/               # Pantallas (home, panel, cuenta…)
│       ├── routes/              # Rutas del panel por rol
│       ├── services/            # Llamadas HTTP
│       ├── stores/              # Zustand
│       ├── styles/
│       └── utils/
├── SETUP_LOCAL.md               # Esta guía
├── readme.MD                    # Visión general del producto
└── .gitignore
```

### Roles de la app

| Rol | Qué puede hacer |
|-----|-----------------|
| `turista` | Explorar, reservar, reseñar, mensajería |
| `anfitrion` | Publicar/editar alojamientos, ver reservas recibidas |
| `admin` | Moderación, categorías, servicios, usuarios |

## 1) Clonar

```bash
git clone <URL_DE_TU_REPO>
cd ECOTURISMO
```

## 2) Base de datos PostgreSQL

1. Crea una base vacía:

```sql
CREATE DATABASE ecoturismo;
```

2. Restaura tu dump / esquema base si ya tienes uno, **o** asegúrate de tener las tablas núcleo (`usuario`, `alojamiento`, etc.).

3. Aplica las migraciones en orden (desde `psql` o pgAdmin):

```bash
psql -U postgres -d ecoturismo -f BACKEND/migrations/001_unidad_to_alojamiento.sql
psql -U postgres -d ecoturismo -f BACKEND/migrations/002_servicios_e_iconos.sql
psql -U postgres -d ecoturismo -f BACKEND/migrations/003_mensajes.sql
```

> Si `001` ya se corrió en tu entorno, no la vuelvas a ejecutar. Revisa primero las columnas de `alojamiento` (`precio_noche`, `capacidad`, …).

## 3) Backend

```bash
cd BACKEND
cp .env.example .env
# En Windows PowerShell:
# Copy-Item .env.example .env
```

Edita `BACKEND/.env` con tus valores reales (`DB_*`, `JWT_SECRET`, Cloudinary).

```bash
npm install
npm run dev
```

Deberías ver algo como: `Servidor corriendo en puerto 3000`.

- API: http://localhost:3000/api  
- Swagger: http://localhost:3000/api/docs  
- Spec JSON: http://localhost:3000/api/docs.json  

## 4) Frontend

En otra terminal:

```bash
cd FRONTEND
cp .env.example .env
# Copy-Item .env.example .env
```

```bash
npm install
npm run dev
```

Abre la URL que muestre Vite (normalmente http://localhost:5173).

El proxy de Vite también reenvía `/api` a `http://localhost:3000` (ver `vite.config.js`), pero la fuente de verdad del cliente es `VITE_API_URL`.

## 5) Primer uso rápido

1. Regístrate como `anfitrion` o `turista`.
2. Crea un alojamiento (mapa + municipio + categorías + servicios + fotos).
3. Con un usuario `admin`, aprueba el alojamiento en el panel de moderación.
4. Como turista, reserva y deja una reseña.

## Checklist antes de subir a GitHub

- [ ] `BACKEND/.env` y `FRONTEND/.env` **no** están en `git status` (solo `.env.example`)
- [ ] No hay dumps `.sql.gz` / `.dump` / backups con datos reales
- [ ] No hay `node_modules/` ni `FRONTEND/dist/`
- [ ] Revisaste que no se cuele `JWT_SECRET`, passwords ni keys de Cloudinary

Si un `.env` ya estaba trackeado en el historial:

```bash
git rm --cached BACKEND/.env
git rm --cached FRONTEND/.env   # solo si existía en el repo
```

Luego haz un commit que quite esos archivos del índice (los locales se conservan).

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| `no existe la columna «precio_noche»` | Falta migración `001` |
| Error al subir imágenes | Variables Cloudinary en `.env` |
| CORS / API unreachable | Backend en `:3000` y `VITE_API_URL` correcto |
| 401 en rutas protegidas | Login → header `Authorization: Bearer <token>` |
| Swagger no carga | Abre `/api/docs` con el backend en marcha |

## Scripts útiles

```bash
# Backend
cd BACKEND
npm run dev      # desarrollo con nodemon
npm start        # producción simple
npm test         # Jest + Supertest

# Frontend
cd FRONTEND
npm run dev
npm run build
npm run preview
```
