const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,                   
  message: { message: "Demasiados intentos de login. Intenta más tarde." },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { loginLimiter };
