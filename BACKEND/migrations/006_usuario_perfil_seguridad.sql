-- Datos básicos y de seguridad del perfil de usuario
ALTER TABLE public.usuario
  ADD COLUMN IF NOT EXISTS telefono character varying(30),
  ADD COLUMN IF NOT EXISTS fecha_nacimiento date,
  ADD COLUMN IF NOT EXISTS tipo_documento character varying(10),
  ADD COLUMN IF NOT EXISTS numero_documento character varying(40),
  ADD COLUMN IF NOT EXISTS ciudad character varying(100),
  ADD COLUMN IF NOT EXISTS acepta_terminos_at timestamp without time zone;

CREATE UNIQUE INDEX IF NOT EXISTS usuario_numero_documento_key
  ON public.usuario (numero_documento)
  WHERE numero_documento IS NOT NULL;
