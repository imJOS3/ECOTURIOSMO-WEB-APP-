CREATE TYPE estado_reserva AS ENUM ('pendiente', 'confirmada', 'cancelada');

CREATE TABLE reserva (
    id SERIAL PRIMARY KEY,
    id_turista INT NOT NULL,
    id_alojamiento INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado estado_reserva DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_turista
    FOREIGN KEY (id_turista)
    REFERENCES usuario(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_alojamiento
    FOREIGN KEY (id_alojamiento)
    REFERENCES alojamiento(id)
    ON DELETE CASCADE
);