
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CodeMath Science Hub API",
      version: "1.0.0",
      description: "Educational API for kids - Programming, Math, Physics",
      contact: {
        name: "Laura Nunez",
        email: "laupao41@gmail.com"
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User unique ID"
            },
            email: {
              type: "string",
              format: "email",
              description: "User email"
            },
            name: {
              type: "string",
              description: "User name"
            },
            role: {
              type: "string",
              enum: ["parent", "admin"],
              description: "User role"
            },
            isActive: {
              type: "boolean",
              description: "Indicates if user is active"
            }
          }
        },
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Product unique ID"
            },
            name: {
              type: "string",
              description: "Product name"
            },
            description: {
              type: "string",
              description: "Product description"
            },
            category: {
              type: "string",
              enum: ["programming", "math", "physics"],
              description: "Product category"
            },
            price: {
              type: "number",
              minimum: 0,
              description: "Product price"
            },
            type: {
              type: "string",
              enum: ["game", "app", "book", "course"],
              description: "Product type"
            },
            isActive: {
              type: "boolean",
              description: "Indicates if product is active"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message"
            },
            code: {
              type: "string",
              description: "Error code"
            }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]  // Vuelve a esta pero con diagnóstico
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
