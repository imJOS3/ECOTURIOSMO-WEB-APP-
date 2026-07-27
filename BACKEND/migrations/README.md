# Migraciones EcoTurismo

## `001_unidad_to_alojamiento.sql`
Unifica el modelo: solo alojamiento (sin unidad).

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
