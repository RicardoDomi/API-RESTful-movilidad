import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";
const level = process.env.LOG_LEVEL || "info";

export const logger = pino({
  level,
  transport: isDev
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: true },
      }
    : undefined,
  base: { service: "api-restful-movilidad" },
});
