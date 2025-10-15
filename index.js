const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const pino = require("pino");
const pinoHttp = require("pino-http");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/openApi.json');
const journeysRoutes = require("./src/routes/journey");
const authRoutes = require("./src/routes/auth");
const swaggerDocument = require(path.join(__dirname, "src", "docs", "openapi.json"));
dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV !== "production"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
});

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad + logs
app.use(helmet());
app.use(pinoHttp({ logger }));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static(path.join(__dirname, "public")));


app.use("/auth", authRoutes);
app.use("/routes", journeysRoutes);

app.get("/", (_req, res) => {
  res.send("API RESTful Movilidad funcionando");
});


app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);

app.get("/dashboard", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
);

const Modelauth = require("./src/models/Modelauth");
const sequelize = require("./src/config/Authdatabase");

async function seedDemoUser() {
  try {
    await sequelize.authenticate();
    logger.info("Conexión a BD OK (SQLite)");
    await sequelize.sync();

    const [u, created] = await Modelauth.findOrCreate({
      where: { username: "demo" },
      defaults: { password: "12345678" },
    });

    if (created) logger.info("Usuario demo creado (demo / 12345678)");
    else logger.info("Usuario demo ya existe (demo / 12345678)");
  } catch (e) {
    logger.warn("No se pudo crear usuario demo: " + e.message);
  }
}
seedDemoUser();


app.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});
