-- Foto de perfil del usuario (Cloudinary)
ALTER TABLE public.usuario
  ADD COLUMN IF NOT EXISTS avatar_url character varying(500),
  ADD COLUMN IF NOT EXISTS avatar_public_id character varying(255);
