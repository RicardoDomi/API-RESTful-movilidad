const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const pino = require("pino");
const pinoHttp = require("pino-http");
const morgan = require("morgan");
const helmet = require("helmet");

dotenv.config();

// Configuración de base de datos y modelos
const sequelize = require("./src/config/Authdatabase");
require("./src/models/Modelhistory")(sequelize);

// Rutas
const journeysRoutes = require("./src/routes/journey");
const authRoutes = require("./src/routes/auth");
const historyRoutes = require("./src/routes/history");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: { target: "pino-pretty", options: { colorize: true } },
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(pinoHttp());
app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(morgan("combined")); // Desactiva logs en test
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Rutas principales
app.use("/auth", authRoutes);
app.use("/routes", journeysRoutes);
app.use("/history", historyRoutes);

// Rutas simples
app.get("/", (_req, res) => res.send("API RESTful Movilidad funcionando"));
app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);

// Manejador de errores
app.use((err, _req, res, _next) => {
  const msg = err?.parent?.message || err?.message || "Error interno del servidor";
  if (process.env.NODE_ENV !== "test") console.error("ERROR:", msg);
  res.status(500).json({ error: msg });
});

// Función que arranca el servidor y sincroniza la DB
async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  if (process.env.NODE_ENV !== "test")
    console.log("[DB] Conexión OK y modelos sincronizados");

  const server = app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`);
  });
  return server;
}

// Solo inicia el servidor si se ejecuta directamente con node index.js
if (require.main === module && process.env.NODE_ENV !== "test") {
  start().catch((e) => {
    console.error("[DB] Error:", e.message);
    process.exit(1);
  });
}

// para Jest / Supertest
module.exports = { app, start, sequelize };
