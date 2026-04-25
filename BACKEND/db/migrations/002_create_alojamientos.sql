CREATE TABLE alojamiento (
    id SERIAL PRIMARY KEY,
    id_anfitrion INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    latitud DECIMAL(9,6),
    longitud DECIMAL(9,6),
    estado VARCHAR(20) DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_anfitrion
    FOREIGN KEY (id_anfitrion)
    REFERENCES usuario(id)
    ON DELETE CASCADE
);