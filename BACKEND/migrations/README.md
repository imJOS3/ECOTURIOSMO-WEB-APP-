# Migraciones EcoTurismo

## Neon / DB vacía (primera vez)

Si ves `relation "usuario" does not exist`, la base aún no tiene tablas.
Ejecuta **una sola vez** el esquema completo:

1. Abre Neon → **SQL Editor**
2. Pega el contenido de `000_schema_base.sql`
3. Run

Ese archivo ya incluye servicios, iconos y mensajería (no hace falta correr 001–003 después, salvo que tu dump sea más viejo).

```bash
# Regenerar desde tu Postgres local (solo estructura, sin datos):
pg_dump -U postgres -d ecoturismo --schema-only --no-owner --no-privileges -f BACKEND/migrations/000_schema_base.sql
```

## `001_unidad_to_alojamiento.sql`
Unifica el modelo: solo alojamiento (sin unidad). Solo si vienes del modelo viejo.

```bash
node migrations/run-001.js
```

## `002_servicios_e_iconos.sql`
Catálogo de servicios + iconos de categorías.

```bash
psql -U postgres -d NOMBRE_DE_TU_BASE -f "BACKEND/migrations/002_servicios_e_iconos.sql"
```

## `003_mensajes.sql`
Chat: conversaciones y mensajes (turista↔anfitrión, admin↔anfitrión).

```bash
node migrations/run-003.js
```

API: `/api/mensajes`

## `005_usuario_avatar.sql`
Foto de perfil: columnas `avatar_url` y `avatar_public_id` en `usuario`.

```bash
node migrations/run-005.js
```

API: `PUT /api/usuarios/:id/avatar` (multipart campo `avatar`), `DELETE /api/usuarios/:id/avatar`

## `007_alojamiento_imagen_espacio.sql`
Clasifica fotos del alojamiento por zona: `general`, `habitacion`, `bano`, `cocina`, `sala`, `comedor`, `exterior`, `otro`.

```bash
node migrations/run-007.js
```

API: campo `espacio` en `POST /api/alojamiento-imagen`; `PATCH /api/alojamiento-imagen/:id/espacio`
