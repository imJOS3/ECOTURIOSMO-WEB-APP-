# 🌿 DOCUMENTACIÓN BACKEND - ECOTURISMO

## 📌 Descripción general

Este backend es una API REST desarrollada con Node.js y Express para gestionar una plataforma de ecoturismo tipo Airbnb.

Permite:

* Registro e inicio de sesión de usuarios
* Gestión de alojamientos
* Creación de reservas
* Registro de pagos
* Publicación de reseñas
* Administración de categorías

---

# 🧠 Arquitectura del sistema

El sistema está dividido en capas:

* **Routes** → define endpoints
* **Controller** → maneja request/response
* **Service** → lógica de negocio
* **Queries** → consultas SQL
* **Middlewares** → seguridad y validaciones

---

# 🔐 AUTENTICACIÓN Y AUTORIZACIÓN

## 🔑 Autenticación (JWT)

El sistema utiliza **JWT (JSON Web Token)**.

### Flujo:

1. Usuario hace login
2. El backend genera un token
3. El cliente lo envía en cada request protegida

### Header obligatorio:

```
Authorization: Bearer TOKEN
```

---

## 🚫 ERRORES DE AUTENTICACIÓN

### ❌ No token

Si no envías token:

```json
{
  "message": "No autorizado"
}
```

👉 Causa:

* No se envió header Authorization

---

### ❌ Token inválido o expirado

```json
{
  "message": "Token inválido o expirado"
}
```

👉 Causa:

* Token mal formado
* Token vencido

---

## 🛡️ Autorización (roles)

Después de autenticar, se valida el **rol del usuario**.

---

# 👥 ROLES DEL SISTEMA

## 🧍‍♂️ Turista

Puede:

* Ver alojamientos
* Crear reservas
* Crear reseñas
* Ver sus reservas

No puede:

* Crear alojamientos
* Crear categorías
* Ver todos los usuarios

---

## 🏡 Anfitrión

Puede:

* Crear alojamientos
* Ver sus alojamientos
* Gestionar disponibilidad

También puede:

* Todo lo de turista

---

## 🛠️ Admin

Puede:

* Ver todos los usuarios
* Crear categorías
* Gestionar todo el sistema

---

# 🚫 ERRORES DE AUTORIZACIÓN

### ❌ Rol incorrecto

```json
{
  "message": "No autorizado"
}
```

👉 Ejemplo:

* Un turista intenta crear alojamiento

---

# 🔄 FLUJO DEL SISTEMA

## 🧭 Flujo principal

1. Registro de usuario
2. Login → получение token
3. Anfitrión crea alojamiento
4. Turista reserva alojamiento
5. Usuario paga
6. Usuario deja reseña

---

# 📦 MÓDULOS IMPLEMENTADOS

## 🔐 Auth

* Registro
* Login
* Generación de token

---

## 👤 Usuarios

* CRUD básico
* Gestión de roles

---

## 🏡 Alojamientos

* Crear
* Listar
* Filtrar por anfitrión

---

## 📅 Reservas

* Crear reservas
* Ver reservas del usuario
* Cambiar estado

---

## 💳 Pagos

* Registrar pago de reserva
* Consultar pagos

---

## ⭐ Reseñas

* Crear reseñas
* Ver reseñas por alojamiento

---

## 🏷️ Categorías

* Crear (solo admin)
* Listar

---

# 🧪 PRUEBAS RECOMENDADAS

## 1. Auth

* Registro
* Login
* Guardar token

---

## 2. Seguridad

### Probar SIN token

Debe fallar con 401

### Probar con rol incorrecto

Debe fallar con 403

---

## 3. Flujo completo

1. Crear usuario
2. Login
3. Crear alojamiento
4. Crear reserva
5. Crear pago
6. Crear reseña

---

# ⚠️ LIMITACIONES ACTUALES (IMPORTANTE)

Actualmente el sistema NO tiene:

* ❌ Validación de fechas en reservas
* ❌ Prevención de doble reserva
* ❌ Cálculo automático de precio
* ❌ Relación categorías ↔ alojamientos
* ❌ Subida de imágenes
* ❌ Validación de datos (Zod/Joi)

---

# 🚀 Para el futuro mejorar dichas limitaciones

Para llevar el sistema a nivel profesional:

* Validar disponibilidad de fechas
* Evitar reservas solapadas
* Calcular precio automáticamente
* Relacionar categorías con alojamientos
* Subir imágenes (Cloudinary/S3)
* Validar inputs con Zod

---

# 📌 Estado actual

✔ Backend funcional
✔ Estructura profesional
✔ pendiente por actulizar
