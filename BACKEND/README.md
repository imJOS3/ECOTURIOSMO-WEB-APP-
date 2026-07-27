# 🌿 EcoTurismo API

> Backend REST API para una plataforma de ecoturismo tipo Airbnb — construida con Node.js, Express y JWT.

---

## 📌 Descripción

EcoTurismo API permite gestionar una plataforma de alojamientos sostenibles. Incluye autenticación segura con JWT, control de roles (turista, anfitrión, admin), reservas, pagos, reseñas y categorías.

---

## 🚀 Tecnologías

- **Node.js** + **Express**
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **SQL** con consultas parametrizadas
- **Jest** + **Supertest** para testing

---


## 🔐 Autenticación

El sistema usa **JWT**. Luego de registrarse o iniciar sesión, el cliente debe enviar el token en cada request protegida:

```
Authorization: Bearer <TOKEN>
```

### Errores de autenticación

| Código | Mensaje                        | Causa                              |
|--------|--------------------------------|------------------------------------|
| 401    | `No autorizado`                | No se envió el header              |
| 401    | `Token inválido o expirado`    | Token mal formado, vencido o firma incorrecta |

---

## 👥 Roles

| Rol         | Permisos                                                                 |
|-------------|--------------------------------------------------------------------------|
| 🧍 Turista   | Ver alojamientos, crear reservas y reseñas, ver sus reservas, pagar             |
| 🏡 Anfitrión | Todo lo de turista + crear y gestionar sus alojamientos                  |
| 🛠️ Admin     | Todo lo anterior + gestionar usuarios, categorías y contenido del sistema |

> Acceso con rol incorrecto devuelve `403 Forbidden`.

---

## 📦 Módulos

| Módulo         | Descripción                                              |
|----------------|----------------------------------------------------------|
| 🔐 Auth         | Registro, login, JWT, bcrypt                            |
| 👤 Usuarios     | CRUD, roles, protección por autenticación               |
| 🏡 Alojamientos | Crear (anfitrión), listar, obtener por ID               |
| 📅 Reservas     | Crear, consultar, base para manejo de estados           |
| 💳 Pagos        | Registrar y consultar pagos por reserva                 |
| ⭐ Reseñas      | Crear y consultar por alojamiento                       |
| 🏷️ Categorías   | Crear (admin), listar                                   |

---

## 🛣️ Rutas (endpoints)

Base URL: `http://localhost:3000/api`

### 📘 Documentación Swagger

Con el servidor en marcha abre:

- **UI interactiva:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Spec OpenAPI JSON:** [http://localhost:3000/api/docs.json](http://localhost:3000/api/docs.json)

En Swagger: **Authorize** → pega el JWT del login (`Bearer` se añade solo).

---

**Auth**
- POST `/api/auth/register` — Registrar usuario (body: `nombre`, `email`, `password`, `rol` opcional).
- POST `/api/auth/login` — Autenticar y recibir `{ user, token }`.

**Usuarios** (`/api/usuarios`)
- GET `/api/usuarios/` — (Auth + `admin`) Listar usuarios.
- GET `/api/usuarios/:id` — (Auth) Obtener usuario por id.
- POST `/api/usuarios/` — Crear usuario (registro manual o por admin).
- PUT `/api/usuarios/:id` — (Auth) Actualizar usuario (admin o propio usuario).
- DELETE `/api/usuarios/:id` — (Auth + `admin`) Eliminar usuario.

**Alojamientos** (`/api/alojamientos`)
- GET `/api/alojamientos/` — (Público / auth opcional) Listar alojamientos visibles según rol.
- GET `/api/alojamientos/:id` — (Auth opcional) Ver alojamiento por id (control de acceso aplica).
- POST `/api/alojamientos/` — (Auth + `anfitrion`) Crear alojamiento (incluye `precio_noche`, `capacidad`, categorías).
- GET `/api/alojamientos/mine` — (Auth + `anfitrion`) Listar alojamientos del anfitrión autenticado.
- PUT `/api/alojamientos/:id` — (Auth + `anfitrion`) Actualizar alojamiento.
- DELETE `/api/alojamientos/:id` — (Auth + `anfitrion`) Eliminar alojamiento.

**Reservas** (`/api/reservas`)
- POST `/api/reservas/` — (Auth) Crear reserva con `id_alojamiento`, `fecha_inicio`, `fecha_fin`.
- GET `/api/reservas/` — (Auth) Listar reservas (según permisos).
- GET `/api/reservas/mine` — (Auth) Listar reservas del usuario autenticado.
- PUT `/api/reservas/:id` — (Auth) Actualizar reserva.
- DELETE `/api/reservas/:id` — (Auth) Cancelar/eliminar reserva.

**Pagos** (`/api/pagos`)
- POST `/api/pagos/` — (Auth) Registrar pago.
- GET `/api/pagos/` — (Auth) Listar pagos.
- GET `/api/pagos/reserva/:id_reserva` — (Auth) Obtener pagos de una reserva.

**Reseñas** (`/api/resenas`)
- POST `/api/resenas/` — (Auth) Crear reseña para un alojamiento.
- GET `/api/resenas/` — Obtener todas las reseñas.
- GET `/api/resenas/alojamiento/:id` — Obtener reseñas de un alojamiento.

**Categorías** (`/api/categorias`)
- POST `/api/categorias/` — (Auth + `admin`) Crear categoría (`tipo: alojamiento`).
- GET `/api/categorias/` — Obtener todas las categorías.

**Moderación (admin)** (`/api/admin/moderacion`)
- POST `/api/admin/moderacion/alojamientos/:id/aprobar` — (Auth + `admin`) Aprobar alojamiento.
- POST `/api/admin/moderacion/alojamientos/:id/rechazar` — (Auth + `admin`) Rechazar alojamiento.
- POST `/api/admin/moderacion/alojamientos/:id/suspender` — (Auth + `admin`) Suspender alojamiento.

Notas:
- Para endpoints protegidos añade header: `Authorization: Bearer <token>`.
- El login devuelve `{ user, token }`.

---

## 📊 Códigos HTTP

| Código | Significado               |
|--------|---------------------------|
| 200    | OK — consulta exitosa     |
| 201    | Created — recurso creado  |
| 401    | Unauthorized — no autenticado |
| 403    | Forbidden — sin permisos  |
| 500    | Internal Server Error     |

---

## 🧪 Testing

Tests de integración implementados con **Jest** y **Supertest**, cubriendo todos los módulos y validando:

- ❌ Acceso sin token → `401`
- ❌ Acceso con rol incorrecto → `403`
- ✅ Acceso correcto → `200` / `201`

### Ejecutar tests

```bash
npm test
```

---

## ⚙️ Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ecoturismo-api.git
cd ecoturismo-api/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar el servidor
npm start 

npm run dev
```

---

## ⚠️ Limitaciones actuales

El sistema aún **no incluye**:


- ❌ Cálculo automático de precios
- ❌ Subida de imágenes
- ❌ Validación avanzada de datos (Zod / Joi)
- ❌ Paginación en endpoints

---

## 🛣️ Mejoras futuras


- [ ] Validación de inputs con Zod o Joi
- [ ] Paginación y filtros en listados
- [ ] Separar entornos de testing y producción
- [ ] agregar apartado para favoritos
- [ ] reseñas tipo foro donde cada usario tenga un perfil y pueda ver e intaracutar con las reseñas de los demas
- [x] Añadir documentación swagger


---

## ✅ Estado actual

| Ítem                          | Estado |
|-------------------------------|--------|
| Backend funcional             | ✔️     |
| Autenticación con JWT         | ✔️     |
| Control de roles              | ✔️     |
| Tests automatizados (100%)    | ✔️     |
| Base de datos estructurada    | ✔️     |
| Arquitectura modular limpia   | ✔️     |

---

## 🎯 Objetivo

Construir un backend robusto, escalable y bien estructurado aplicando buenas prácticas reales de desarrollo backend profesional.

---

## 📄 Licencia

MIT
