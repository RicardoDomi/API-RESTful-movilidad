const { randomUUID } = require("crypto");

const requestLogger = (req, res, next) => {
  const requestId = randomUUID().slice(0, 8); 
  req.requestId = requestId;

  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `[${requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms} ms)`
    );
  });

  next();
};

module.exports = requestLogger;
