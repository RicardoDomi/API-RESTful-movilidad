
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API RESTful Movilidad",
      version: "1.0.0",
      description: "Documentación de endpoints para historial de rutas.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local" },
      
    ],
    tags: [
      { name: "History", description: "Historial de rutas por usuario" },
    ],
    components: {
      schemas: {
        RouteHistory: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 42 },
            originLat: { type: "number", format: "float", example: 20.6736 },
            originLng: { type: "number", format: "float", example: -103.344 },
            destinationLat: { type: "number", format: "float", example: 20.6597 },
            destinationLng: { type: "number", format: "float", example: -103.3496 },
            distanceM: { type: "number", example: 3200 },
            durationS: { type: "integer", example: 540 },
            mode: { type: "string", enum: ["car","bike","walk","transit"], example: "car" },
            usedAt: { type: "string", format: "date-time", example: "2025-10-26T04:00:00.000Z" },
            metadata: { type: "object", additionalProperties: true, example: { traffic: "moderate" } },
            isDeleted: { type: "boolean", example: false }
          }
        },
        CreateRouteHistoryRequest: {
          type: "object",
          required: ["originLat","originLng","destinationLat","destinationLng"],
          properties: {
            originLat: { type: "number", format: "float" },
            originLng: { type: "number", format: "float" },
            destinationLat: { type: "number", format: "float" },
            destinationLng: { type: "number", format: "float" },
            distanceM: { type: "number" },
            durationS: { type: "integer" },
            mode: { type: "string", enum: ["car","bike","walk","transit"] },
            usedAt: { type: "string", format: "date-time" },
            metadata: { type: "object", additionalProperties: true }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Internal Server Error" }
          }
        }
      },
      parameters: {
        UserIdParam: {
          name: "userId", 
          in: "path",
          required: true,
          schema: { type: "integer", minimum: 1 },
          description: "ID del usuario"
        },
        HistoryIdParam: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer", minimum: 1 },
          description: "ID del registro de historial"
        }
      }
    }
  },
  
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
