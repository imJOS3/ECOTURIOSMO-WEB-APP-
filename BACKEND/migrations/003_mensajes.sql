-- =============================================================================
-- Migración 003: mensajería / chat
-- Tipos:
--   reserva     → turista ↔ anfitrión (consulta sobre un alojamiento)
--   moderacion  → admin ↔ anfitrión (aprobación / cambios del listing)
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.conversacion (
  id              SERIAL PRIMARY KEY,
  tipo            VARCHAR(20) NOT NULL
                  CHECK (tipo IN ('reserva', 'moderacion')),
  id_alojamiento  INTEGER REFERENCES public.alojamiento(id) ON DELETE SET NULL,
  asunto          VARCHAR(200),
  created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversacion_participante (
  id_conversacion INTEGER NOT NULL REFERENCES public.conversacion(id) ON DELETE CASCADE,
  id_usuario      INTEGER NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  joined_at       TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id_conversacion, id_usuario)
);

CREATE TABLE IF NOT EXISTS public.mensaje (
  id              SERIAL PRIMARY KEY,
  id_conversacion INTEGER NOT NULL REFERENCES public.conversacion(id) ON DELETE CASCADE,
  id_remitente    INTEGER NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  cuerpo          TEXT NOT NULL,
  created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  read_at         TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_mensaje_conversacion_created
  ON public.mensaje (id_conversacion, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_conversacion_updated
  ON public.conversacion (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversacion_participante_usuario
  ON public.conversacion_participante (id_usuario);

COMMIT;
