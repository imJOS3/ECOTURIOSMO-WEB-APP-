# Pendiente de backend — Detalle de Alojamiento

Estado: **modelo unificado en alojamiento** (sin unidades).
Migración SQL: `BACKEND/migrations/001_unidad_to_alojamiento.sql`

## Campos ya en alojamiento (tras migración)

| Campo | Tipo | Nota |
|---|---|---|
| `precio_noche` | number | obligatorio para crear/reservar |
| `capacidad` | number | huéspedes máximos |
| `es_compartido` | boolean | disponibilidad compartida |
| `cupos_disponibles` | number \| null | opcional |
| `habitaciones` | number \| null | meta del detalle |
| `camas` | number \| null | meta del detalle |
| `banos` | number \| null | meta del detalle |

Las reservas usan `id_alojamiento` (ya no `id_unidad`).

## Placeholders que aún quedan en el frontend

Archivo: `FRONTEND/src/components/Alojamiento/placeholderData.js`

### Datos del anfitrión (`item.anfitrion`)

| Campo | Tipo |
|---|---|
| `nombre` / `nombre_anfitrion` | string |
| `avatar_url` | string |
| `creado_en` / `anfitrion_desde` | fecha ISO |
| `verificado` | boolean |
| `es_superanfitrion` | boolean |
| `num_resenas` | number |
| `calificacion` | number |
| `ocupacion` | string |
| `ciudad`, `pais` | string |
| `indice_respuesta` | number |
| `tiempo_respuesta` | string |

### Políticas / reglas

| Campo | Tipo |
|---|---|
| `politica_cancelacion` | string |
| `reglas_casa` | string[] |
| `seguridad` | string[] |

## Cómo funciona el fallback

```js
const huespedes = item.huespedes ?? item.capacidad ?? PLACEHOLDER_META.huespedes;
```

Si el backend manda el campo, se usa; si no, el placeholder.
