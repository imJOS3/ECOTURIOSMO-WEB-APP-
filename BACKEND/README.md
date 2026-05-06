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

## 🧠 Arquitectura

```
src/
├── routes/        → Endpoints de la API
├── controllers/   → Manejo de request/response
├── services/      → Lógica de negocio
├── queries/       → Consultas SQL parametrizadas
└── middlewares/   → Autenticación, autorización y errores
```

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
| 🧍 Turista   | Ver alojamientos, crear reservas y reseñas, ver sus reservas             |
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
cd ecoturismo-api

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

- ❌ Validación de fechas en reservas
- ❌ Prevención de reservas duplicadas
- ❌ Cálculo automático de precios
- ❌ Relación categorías ↔ alojamientos
- ❌ Subida de imágenes
- ❌ Validación avanzada de datos (Zod / Joi)
- ❌ Paginación en endpoints

---

## 🛣️ Mejoras futuras

- [ ] Validar disponibilidad de fechas y evitar solapamientos
- [ ] Calcular precios dinámicamente
- [ ] Relacionar categorías con alojamientos
- [ ] Subida de imágenes (Cloudinary / S3)
- [ ] Validación de inputs con Zod o Joi
- [ ] Paginación y filtros en listados
- [ ] Separar entornos de testing y producción
- [ ] Dockerizar el backend

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