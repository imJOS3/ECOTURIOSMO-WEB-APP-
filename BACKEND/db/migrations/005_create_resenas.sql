CREATE TABLE resena (
    id SERIAL PRIMARY KEY,
    id_turista INT NOT NULL,
    id_alojamiento INT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_resena_turista
    FOREIGN KEY (id_turista)
    REFERENCES usuario(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_resena_alojamiento
    FOREIGN KEY (id_alojamiento)
    REFERENCES alojamiento(id)
    ON DELETE CASCADE
);