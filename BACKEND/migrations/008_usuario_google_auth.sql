-- Auth con Google: proveedor + id de Google; password opcional para OAuth
ALTER TABLE public.usuario
  ADD COLUMN IF NOT EXISTS auth_provider character varying(20) NOT NULL DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS google_id character varying(64);

ALTER TABLE public.usuario
  ALTER COLUMN password_hash DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS usuario_google_id_key
  ON public.usuario (google_id)
  WHERE google_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'usuario_auth_provider_check'
  ) THEN
    ALTER TABLE public.usuario
      ADD CONSTRAINT usuario_auth_provider_check
      CHECK (auth_provider IN ('local', 'google'));
  END IF;
END $$;
