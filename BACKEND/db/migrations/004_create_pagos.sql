CREATE TYPE estado_pago AS ENUM ('exitoso', 'fallido', 'reembolsado');

CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    id_reserva INT UNIQUE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    estado estado_pago NOT NULL,
    referencia_externa VARCHAR(100),
    fecha_pago TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id)
    ON DELETE CASCADE
);