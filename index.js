// index.js
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// === DB (instancia) y MODELOS ===
const sequelize = require("./src/config/Authdatabase");          // instancia sqlite exportada directa
require("./src/models/Modelhistory")(sequelize);                 // registra el modelo antes del sync

// === Rutas ===
const journeysRoutes = require("./src/routes/journey");
const authRoutes = require("./src/routes/auth");
const historyRoutes = require("./src/routes/history");

// === Logs y seguridad ===
const pino = require("pino");
const pinoHttp = require("pino-http");
const morgan = require("morgan");
const helmet = require("helmet");

dotenv.config();

// === Logger ===
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: { target: "pino-pretty", options: { colorize: true } },
});

logger.info("hello world");

// === App ===
const app = express();
const PORT = process.env.PORT || 3000;

// === Middlewares ===
app.use(pinoHttp());
app.use(express.json());
app.use(morgan("combined"));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.static(path.join(__dirname, "public")));

// === Montaje de rutas ===
app.use("/auth", authRoutes);
app.use("/routes", journeysRoutes);
app.use("/history", historyRoutes);

// === Rutas simples ===
app.get("/", (_req, res) => {
  res.send("API RESTful Movilidad funcionando");
});

app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);

// === Manejador de errores (JSON claro) ===
app.use((err, _req, res, _next) => {
  const msg = err?.parent?.message || err?.message || "Internal Server Error";
  console.error("ERROR:", msg);
  res.status(500).json({ error: msg });
});

// === Arranque: autentica y sincroniza DB, luego escucha ===
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // ⚠️ solo dev; usar migrations en prod
    console.log("[DB] Conexión OK y modelos sincronizados");

    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (e) {
    console.error("[DB] Error:", e.message);
    process.exit(1);
  }
})();
