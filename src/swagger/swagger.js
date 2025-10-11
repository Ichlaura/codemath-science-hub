const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeMath Science Hub API',
      version: '1.0.0',
      description: 'API para plataforma educativa de programación, matemáticas y física para niños',
      contact: {
        name: 'Laura Nunez',
        email: 'tu-email@dominio.com'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
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
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            profilePicture: {
              type: 'string',
              description: 'URL de la foto de perfil'
            },
            role: {
              type: 'string',
              enum: ['parent', 'admin'],
              description: 'Rol del usuario'
            },
            children: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' },
                  interests: { 
                    type: 'array', 
                    items: { type: 'string' } 
                  }
                }
              }
            },
            isActive: {
              type: 'boolean',
              description: 'Indica si el usuario está activo'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del producto'
            },
            name: {
              type: 'string',
              description: 'Nombre del producto'
            },
            description: {
              type: 'string',
              description: 'Descripción del producto'
            },
            category: {
              type: 'string',
              enum: ['programming', 'math', 'physics'],
              description: 'Categoría del producto'
            },
            ageRange: {
              type: 'object',
              properties: {
                min: { 
                  type: 'number', 
                  minimum: 3, 
                  maximum: 18 
                },
                max: { 
                  type: 'number', 
                  minimum: 3, 
                  maximum: 18 
                }
              }
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Precio del producto'
            },
            type: {
              type: 'string',
              enum: ['game', 'app', 'book', 'course'],
              description: 'Tipo de producto'
            },
            imageUrl: {
              type: 'string',
              description: 'URL de la imagen del producto'
            },
            demoUrl: {
              type: 'string',
              description: 'URL de demo del producto'
            },
            features: {
              type: 'array',
              items: { type: 'string' },
              description: 'Características del producto'
            },
            isActive: {
              type: 'boolean',
              description: 'Indica si el producto está activo'
            },
            rating: {
              type: 'object',
              properties: {
                average: { 
                  type: 'number', 
                  minimum: 0, 
                  maximum: 5 
                },
                count: { 
                  type: 'number', 
                  minimum: 0 
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            },
            code: {
              type: 'string',
              description: 'Código de error único'
            },
            details: {
              type: 'array',
              items: { type: 'string' },
              description: 'Detalles adicionales del error'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Ruta a los archivos que contienen la documentación
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };