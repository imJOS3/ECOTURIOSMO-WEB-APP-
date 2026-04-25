-- ENUM de roles
CREATE TYPE rol_usuario AS ENUM ('turista', 'anfitrion', 'admin');

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol rol_usuario NOT NULL DEFAULT 'turista',
    created_at TIMESTAMP DEFAULT NOW()
);