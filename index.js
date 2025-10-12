
const express = require("express");
const dotenv = require("dotenv");
const journeysRoutes = require("./src/routes/journey");
const helmet = require("helmet");
const authRoutes = require("./src/routes/auth");
const pino = require("pino");
const pinoHttp = require('pino-http');
const morgan = require('morgan');
dotenv.config();

const path = require('path')



const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

logger.info("hello world");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(pinoHttp());
app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());
 

app.use(helmet({contentSecurityPolicy: false, crossOriginResourcePolicy: {policy: 'cross-origin'},}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRoutes);



app.use("/routes", journeysRoutes);

app.get("/", (req, res) => {
  res.send("API RESTful Movilidad funcionando");
});

app.get('/login', (_req, res)=> res.sendFile(path.join(__dirname, 'public', 'login.html')));

app.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});