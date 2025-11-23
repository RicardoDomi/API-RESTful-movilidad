const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const pino = require("pino");
const pinoHttp = require("pino-http");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const journeysRoutes = require("./src/routes/journey");
const authRoutes = require("./src/routes/auth");
const historyRoutes = require("./src/routes/history");
const usersRoutes = require("./src/routes/users");
const appikey = require("./src/middleware/middlewareHistory")
const swaggerDocument = require(path.join(__dirname, "src", "docs", "openapi.json"));
const errorHandler = require("./src/middleware/errorHandler");
const requestLogger = require("./src/middleware/requestLogger");

dotenv.config();

const sequelize = require("./src/config/Authdatabase");
require("./src/models/Modelhistory")(sequelize);

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(requestLogger);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(pinoHttp({ logger }));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/routes", journeysRoutes);
app.use("/history", historyRoutes);

// swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use("/users", usersRoutes);

app.get("/", (_req, res) => {
  res.send("API RESTful Movilidad funcionando");
});

app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);

app.get("/dashboard", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
);

app.use(errorHandler);


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
if (require.main === module && process.env.NODE_ENV !== "test") {
  start().catch((e) => {
  console.error("[DB] Error completo:");
  console.error(e);  
});

}




module.exports = start;

