/**
 * OpenAPI 3.0 — documentación Swagger de EcoTurismo API.
 * UI: GET /api/docs
 */

const bearer = [{ bearerAuth: [] }];

const jsonContent = (schema, example) => ({
  content: {
    'application/json': {
      schema,
      ...(example ? { example } : {})
    }
  }
});

const errorResponse = (description) => ({
  description,
  ...jsonContent({ $ref: '#/components/schemas/Error' })
});

export const swaggerConfig = {
  openapi: '3.0.3',
  info: {
    title: 'API EcoTurismo',
    version: '1.0.0',
    description: `
API REST para la plataforma de ecoturismo (alojamientos, reservas, pagos, reseñas, mensajes y moderación).

**Autenticación:** JWT Bearer. Tras \`POST /api/auth/login\` envía el header:

\`Authorization: Bearer &lt;token&gt;\`

**Roles:** \`turista\` · \`anfitrion\` · \`admin\`
    `.trim()
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Local' }
  ],
  tags: [
    { name: 'Auth', description: 'Registro e inicio de sesión' },
    { name: 'Usuarios', description: 'CRUD de usuarios' },
    { name: 'Alojamientos', description: 'Listings bookable' },
    { name: 'Alojamiento imágenes', description: 'Galería de fotos' },
    { name: 'Categorías', description: 'Experiencias / tags' },
    { name: 'Servicios', description: 'Comodidades del alojamiento' },
    { name: 'Reservas', description: 'Reservas de turistas' },
    { name: 'Pagos', description: 'Pagos asociados a reservas' },
    { name: 'Reseñas', description: 'Calificaciones' },
    { name: 'Mensajes', description: 'Conversaciones' },
    { name: 'Moderación', description: 'Aprobar / rechazar / suspender (admin)' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'No token' }
        }
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Ana Pérez' },
          email: { type: 'string', format: 'email', example: 'ana@mail.com' },
          rol: { type: 'string', enum: ['turista', 'anfitrion', 'admin'] },
          telefono: { type: 'string', example: '+573001112233' },
          fecha_nacimiento: { type: 'string', format: 'date', example: '1995-04-12' },
          ciudad: { type: 'string', example: 'Medellín' },
          avatar_url: { type: 'string', nullable: true }
        }
      },
      AuthLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' }
        }
      },
      AuthRegisterRequest: {
        type: 'object',
        required: [
          'nombre',
          'email',
          'password',
          'telefono',
          'fecha_nacimiento',
          'ciudad',
          'acepta_terminos'
        ],
        properties: {
          nombre: { type: 'string', example: 'Ana Pérez' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password', minLength: 8 },
          telefono: { type: 'string', example: '+573001112233' },
          fecha_nacimiento: { type: 'string', format: 'date', example: '1995-04-12' },
          ciudad: { type: 'string', example: 'Medellín' },
          acepta_terminos: { type: 'boolean', example: true },
          rol: { type: 'string', enum: ['turista', 'anfitrion'], default: 'turista' }
        }
      },
      AuthLoginResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/Usuario' },
          token: { type: 'string' }
        }
      },
      Categoria: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nombre: { type: 'string', example: 'Glamping' },
          tipo: { type: 'string', enum: ['alojamiento'], example: 'alojamiento' },
          icono: { type: 'string', example: 'glamping' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      CategoriaInput: {
        type: 'object',
        required: ['nombre', 'tipo'],
        properties: {
          nombre: { type: 'string', minLength: 2, maxLength: 100 },
          tipo: { type: 'string', enum: ['alojamiento'] },
          icono: { type: 'string', maxLength: 50, default: 'check' }
        }
      },
      Servicio: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nombre: { type: 'string', example: 'Wifi' },
          icono: { type: 'string', example: 'wifi' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      ServicioInput: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', minLength: 2, maxLength: 100 },
          icono: { type: 'string', maxLength: 50, default: 'check' }
        }
      },
      Alojamiento: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          id_anfitrion: { type: 'integer' },
          titulo: { type: 'string' },
          descripcion: { type: 'string' },
          ubicacion: { type: 'string' },
          latitud: { type: 'number', nullable: true },
          longitud: { type: 'number', nullable: true },
          precio_noche: { type: 'number' },
          capacidad: { type: 'integer' },
          es_compartido: { type: 'boolean' },
          cupos_disponibles: { type: 'integer', nullable: true },
          habitaciones: { type: 'integer', nullable: true },
          camas: { type: 'integer', nullable: true },
          banos: { type: 'integer', nullable: true },
          estado: {
            type: 'string',
            enum: ['pendiente_revision', 'aprobado', 'rechazado', 'suspendido']
          },
          categorias: {
            type: 'array',
            items: { $ref: '#/components/schemas/Categoria' }
          },
          servicios: {
            type: 'array',
            items: { $ref: '#/components/schemas/Servicio' }
          },
          imagenes: {
            type: 'array',
            items: { $ref: '#/components/schemas/AlojamientoImagen' }
          }
        }
      },
      AlojamientoInput: {
        type: 'object',
        required: ['titulo', 'descripcion', 'ubicacion', 'precio_noche', 'capacidad', 'categorias'],
        properties: {
          titulo: { type: 'string', minLength: 3, maxLength: 150 },
          descripcion: { type: 'string', minLength: 10 },
          ubicacion: { type: 'string', example: 'Salento, Quindío, Colombia' },
          latitud: { type: 'number', nullable: true },
          longitud: { type: 'number', nullable: true },
          precio_noche: { type: 'number', exclusiveMinimum: 0 },
          capacidad: { type: 'integer', minimum: 1 },
          es_compartido: { type: 'boolean', default: false },
          cupos_disponibles: { type: 'integer', nullable: true },
          habitaciones: { type: 'integer', nullable: true },
          camas: { type: 'integer', nullable: true },
          banos: { type: 'integer', nullable: true },
          categorias: {
            type: 'array',
            minItems: 1,
            items: { type: 'integer' },
            example: [2, 8]
          },
          servicios: {
            type: 'array',
            items: { type: 'integer' },
            example: [1, 2, 11]
          }
        }
      },
      AlojamientoImagen: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          id_alojamiento: { type: 'integer' },
          url: { type: 'string', format: 'uri' },
          public_id: { type: 'string' },
          portada: { type: 'boolean' }
        }
      },
      Reserva: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          id_turista: { type: 'integer' },
          id_alojamiento: { type: 'integer' },
          fecha_inicio: { type: 'string', format: 'date' },
          fecha_fin: { type: 'string', format: 'date' },
          total: { type: 'number' },
          estado: { type: 'string' }
        }
      },
      ReservaInput: {
        type: 'object',
        required: ['id_alojamiento', 'fecha_inicio', 'fecha_fin'],
        properties: {
          id_alojamiento: { type: 'integer' },
          fecha_inicio: { type: 'string', format: 'date', example: '2026-08-10' },
          fecha_fin: { type: 'string', format: 'date', example: '2026-08-14' }
        }
      },
      Pago: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          id_reserva: { type: 'integer' },
          monto: { type: 'number' },
          metodo: { type: 'string' },
          referencia_externa: { type: 'string', nullable: true },
          estado: { type: 'string' }
        }
      },
      PagoInput: {
        type: 'object',
        required: ['id_reserva', 'monto', 'metodo'],
        properties: {
          id_reserva: { type: 'integer' },
          monto: { type: 'number' },
          metodo: { type: 'string', example: 'tarjeta' },
          referencia_externa: { type: 'string', nullable: true }
        }
      },
      Resena: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          id_alojamiento: { type: 'integer' },
          id_usuario: { type: 'integer' },
          calificacion: { type: 'integer', minimum: 1, maximum: 5 },
          comentario: { type: 'string' }
        }
      },
      ResenaInput: {
        type: 'object',
        required: ['id_alojamiento', 'calificacion'],
        properties: {
          id_alojamiento: { type: 'integer' },
          calificacion: { type: 'integer', minimum: 1, maximum: 5 },
          comentario: { type: 'string' }
        }
      },
      ConversacionInput: {
        type: 'object',
        required: ['tipo', 'id_alojamiento', 'mensaje_inicial'],
        properties: {
          tipo: { type: 'string', enum: ['reserva', 'moderacion'] },
          id_alojamiento: { type: 'integer' },
          asunto: { type: 'string', maxLength: 200, nullable: true },
          mensaje_inicial: { type: 'string', minLength: 1, maxLength: 2000 }
        }
      },
      MensajeInput: {
        type: 'object',
        required: ['cuerpo'],
        properties: {
          cuerpo: { type: 'string', minLength: 1, maxLength: 2000 }
        }
      },
      ModeracionMotivo: {
        type: 'object',
        properties: {
          motivo: { type: 'string', example: 'Fotos insuficientes / incumplimiento de normas' }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/AuthRegisterRequest' })
        },
        responses: {
          201: { description: 'Usuario creado', ...jsonContent({ $ref: '#/components/schemas/Usuario' }) },
          400: errorResponse('Datos inválidos o email ya registrado')
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/AuthLoginRequest' })
        },
        responses: {
          200: { description: 'OK', ...jsonContent({ $ref: '#/components/schemas/AuthLoginResponse' }) },
          401: errorResponse('Credenciales inválidas')
        }
      }
    },

    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios (admin)',
        security: bearer,
        responses: {
          200: {
            description: 'Lista de usuarios',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Usuario' } })
          },
          401: errorResponse('No autenticado'),
          403: errorResponse('Sin permisos')
        }
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear usuario',
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/AuthRegisterRequest' })
        },
        responses: {
          201: { description: 'Creado', ...jsonContent({ $ref: '#/components/schemas/Usuario' }) }
        }
      }
    },
    '/usuarios/{id}': {
      get: {
        tags: ['Usuarios'],
        summary: 'Obtener usuario por id',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK', ...jsonContent({ $ref: '#/components/schemas/Usuario' }) },
          404: errorResponse('No encontrado')
        }
      },
      put: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          ...jsonContent({
            type: 'object',
            required: ['nombre', 'email', 'rol'],
            properties: {
              nombre: { type: 'string' },
              email: { type: 'string', format: 'email' },
              rol: { type: 'string', enum: ['turista', 'anfitrion', 'admin'] }
            }
          })
        },
        responses: {
          200: { description: 'Actualizado', ...jsonContent({ $ref: '#/components/schemas/Usuario' }) }
        }
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Eliminar usuario (admin)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado' },
          403: errorResponse('Solo admin')
        }
      }
    },

    '/alojamientos': {
      get: {
        tags: ['Alojamientos'],
        summary: 'Listar alojamientos',
        description: 'Público: solo aprobados. Anfitrión/admin: según rol (auth opcional).',
        security: bearer,
        responses: {
          200: {
            description: 'Lista',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Alojamiento' } })
          }
        }
      },
      post: {
        tags: ['Alojamientos'],
        summary: 'Crear alojamiento (anfitrión)',
        security: bearer,
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/AlojamientoInput' })
        },
        responses: {
          201: { description: 'Creado (queda en pendiente_revision)', ...jsonContent({ $ref: '#/components/schemas/Alojamiento' }) },
          401: errorResponse('No autenticado'),
          403: errorResponse('Requiere rol anfitrion')
        }
      }
    },
    '/alojamientos/mine': {
      get: {
        tags: ['Alojamientos'],
        summary: 'Mis alojamientos (anfitrión)',
        security: bearer,
        responses: {
          200: {
            description: 'Lista del anfitrión autenticado',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Alojamiento' } })
          }
        }
      }
    },
    '/alojamientos/{id}': {
      get: {
        tags: ['Alojamientos'],
        summary: 'Obtener alojamiento por id',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK', ...jsonContent({ $ref: '#/components/schemas/Alojamiento' }) },
          404: errorResponse('No encontrado o no visible')
        }
      },
      put: {
        tags: ['Alojamientos'],
        summary: 'Actualizar alojamiento (anfitrión)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/AlojamientoInput' })
        },
        responses: {
          200: { description: 'Actualizado', ...jsonContent({ $ref: '#/components/schemas/Alojamiento' }) }
        }
      },
      delete: {
        tags: ['Alojamientos'],
        summary: 'Eliminar alojamiento (anfitrión)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado' }
        }
      }
    },

    '/alojamiento-imagen': {
      post: {
        tags: ['Alojamiento imágenes'],
        summary: 'Subir imagen (multipart)',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['id_alojamiento', 'imagen'],
                properties: {
                  id_alojamiento: { type: 'integer' },
                  imagen: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Imagen creada', ...jsonContent({ $ref: '#/components/schemas/AlojamientoImagen' }) }
        }
      }
    },
    '/alojamiento-imagen/alojamiento/{id_alojamiento}': {
      get: {
        tags: ['Alojamiento imágenes'],
        summary: 'Listar imágenes de un alojamiento',
        parameters: [
          { name: 'id_alojamiento', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: {
            description: 'Galería',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/AlojamientoImagen' } })
          }
        }
      }
    },
    '/alojamiento-imagen/{id}': {
      put: {
        tags: ['Alojamiento imágenes'],
        summary: 'Actualizar imagen (opcionalmente reemplazar archivo)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  imagen: { type: 'string', format: 'binary' },
                  portada: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Actualizada', ...jsonContent({ $ref: '#/components/schemas/AlojamientoImagen' }) }
        }
      },
      delete: {
        tags: ['Alojamiento imágenes'],
        summary: 'Eliminar imagen',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminada' }
        }
      }
    },

    '/categorias': {
      get: {
        tags: ['Categorías'],
        summary: 'Listar categorías',
        responses: {
          200: {
            description: 'Lista',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Categoria' } })
          }
        }
      },
      post: {
        tags: ['Categorías'],
        summary: 'Crear categoría (admin)',
        security: bearer,
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/CategoriaInput' })
        },
        responses: {
          201: { description: 'Creada', ...jsonContent({ $ref: '#/components/schemas/Categoria' }) }
        }
      }
    },
    '/categorias/{id}': {
      get: {
        tags: ['Categorías'],
        summary: 'Obtener categoría',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK', ...jsonContent({ $ref: '#/components/schemas/Categoria' }) },
          404: errorResponse('No encontrada')
        }
      },
      put: {
        tags: ['Categorías'],
        summary: 'Actualizar categoría (admin)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/CategoriaInput' })
        },
        responses: {
          200: { description: 'Actualizada', ...jsonContent({ $ref: '#/components/schemas/Categoria' }) }
        }
      },
      delete: {
        tags: ['Categorías'],
        summary: 'Eliminar categoría (admin)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminada' }
        }
      }
    },

    '/servicios': {
      get: {
        tags: ['Servicios'],
        summary: 'Listar servicios / comodidades',
        responses: {
          200: {
            description: 'Catálogo',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Servicio' } })
          }
        }
      },
      post: {
        tags: ['Servicios'],
        summary: 'Crear servicio (admin)',
        security: bearer,
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/ServicioInput' })
        },
        responses: {
          201: { description: 'Creado', ...jsonContent({ $ref: '#/components/schemas/Servicio' }) }
        }
      }
    },
    '/servicios/{id}': {
      get: {
        tags: ['Servicios'],
        summary: 'Obtener servicio',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK', ...jsonContent({ $ref: '#/components/schemas/Servicio' }) },
          404: errorResponse('No encontrado')
        }
      },
      put: {
        tags: ['Servicios'],
        summary: 'Actualizar servicio (admin)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/ServicioInput' })
        },
        responses: {
          200: { description: 'Actualizado', ...jsonContent({ $ref: '#/components/schemas/Servicio' }) }
        }
      },
      delete: {
        tags: ['Servicios'],
        summary: 'Eliminar servicio (admin)',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminado' }
        }
      }
    },

    '/reservas': {
      get: {
        tags: ['Reservas'],
        summary: 'Listar reservas',
        security: bearer,
        responses: {
          200: {
            description: 'Lista',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Reserva' } })
          }
        }
      },
      post: {
        tags: ['Reservas'],
        summary: 'Crear reserva',
        security: bearer,
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/ReservaInput' })
        },
        responses: {
          201: { description: 'Creada', ...jsonContent({ $ref: '#/components/schemas/Reserva' }) },
          400: errorResponse('Fechas inválidas'),
          403: errorResponse('Alojamiento no aprobado')
        }
      }
    },
    '/reservas/mine': {
      get: {
        tags: ['Reservas'],
        summary: 'Mis reservas (turista)',
        security: bearer,
        responses: {
          200: {
            description: 'Reservas del usuario',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Reserva' } })
          }
        }
      }
    },
    '/reservas/anfitrion': {
      get: {
        tags: ['Reservas'],
        summary: 'Reservas recibidas (anfitrión)',
        security: bearer,
        responses: {
          200: {
            description: 'Reservas de mis alojamientos',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Reserva' } })
          }
        }
      }
    },
    '/reservas/{id}': {
      put: {
        tags: ['Reservas'],
        summary: 'Actualizar reserva',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          ...jsonContent({
            type: 'object',
            properties: {
              fecha_inicio: { type: 'string', format: 'date' },
              fecha_fin: { type: 'string', format: 'date' },
              estado: { type: 'string' }
            }
          })
        },
        responses: {
          200: { description: 'Actualizada', ...jsonContent({ $ref: '#/components/schemas/Reserva' }) }
        }
      },
      delete: {
        tags: ['Reservas'],
        summary: 'Eliminar / cancelar reserva',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Eliminada' }
        }
      }
    },

    '/pagos': {
      get: {
        tags: ['Pagos'],
        summary: 'Listar pagos',
        security: bearer,
        responses: {
          200: {
            description: 'Lista',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Pago' } })
          }
        }
      },
      post: {
        tags: ['Pagos'],
        summary: 'Registrar pago',
        security: bearer,
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/PagoInput' })
        },
        responses: {
          201: { description: 'Creado', ...jsonContent({ $ref: '#/components/schemas/Pago' }) }
        }
      }
    },
    '/pagos/reserva/{id_reserva}': {
      get: {
        tags: ['Pagos'],
        summary: 'Pagos de una reserva',
        security: bearer,
        parameters: [
          { name: 'id_reserva', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: {
            description: 'Pagos',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Pago' } })
          }
        }
      }
    },

    '/resenas': {
      get: {
        tags: ['Reseñas'],
        summary: 'Listar todas las reseñas',
        responses: {
          200: {
            description: 'Lista',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Resena' } })
          }
        }
      },
      post: {
        tags: ['Reseñas'],
        summary: 'Crear reseña',
        security: bearer,
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/ResenaInput' })
        },
        responses: {
          201: { description: 'Creada', ...jsonContent({ $ref: '#/components/schemas/Resena' }) }
        }
      }
    },
    '/resenas/alojamiento/{id}': {
      get: {
        tags: ['Reseñas'],
        summary: 'Reseñas de un alojamiento',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Lista',
            ...jsonContent({ type: 'array', items: { $ref: '#/components/schemas/Resena' } })
          }
        }
      }
    },

    '/mensajes': {
      get: {
        tags: ['Mensajes'],
        summary: 'Mis conversaciones',
        security: bearer,
        responses: {
          200: { description: 'Inbox del usuario autenticado' }
        }
      },
      post: {
        tags: ['Mensajes'],
        summary: 'Abrir o crear conversación',
        security: bearer,
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/ConversacionInput' })
        },
        responses: {
          200: { description: 'Conversación existente o creada' },
          201: { description: 'Conversación creada' }
        }
      }
    },
    '/mensajes/{id}': {
      get: {
        tags: ['Mensajes'],
        summary: 'Detalle de conversación',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Conversación + mensajes' },
          404: errorResponse('No encontrada')
        }
      }
    },
    '/mensajes/{id}/mensajes': {
      post: {
        tags: ['Mensajes'],
        summary: 'Enviar mensaje en una conversación',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          ...jsonContent({ $ref: '#/components/schemas/MensajeInput' })
        },
        responses: {
          201: { description: 'Mensaje enviado' }
        }
      }
    },

    '/admin/moderacion/alojamientos/{id}/aprobar': {
      post: {
        tags: ['Moderación'],
        summary: 'Aprobar alojamiento',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Aprobado' },
          403: errorResponse('Solo admin')
        }
      }
    },
    '/admin/moderacion/alojamientos/{id}/rechazar': {
      post: {
        tags: ['Moderación'],
        summary: 'Rechazar alojamiento',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          ...jsonContent({ $ref: '#/components/schemas/ModeracionMotivo' })
        },
        responses: {
          200: { description: 'Rechazado' }
        }
      }
    },
    '/admin/moderacion/alojamientos/{id}/suspender': {
      post: {
        tags: ['Moderación'],
        summary: 'Suspender alojamiento',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          ...jsonContent({ $ref: '#/components/schemas/ModeracionMotivo' })
        },
        responses: {
          200: { description: 'Suspendido' }
        }
      }
    },
    '/admin/moderacion/log': {
      get: {
        tags: ['Moderación'],
        summary: 'Log de moderación',
        security: bearer,
        responses: {
          200: { description: 'Histororial de acciones' }
        }
      }
    }
  }
};

export default swaggerConfig;
