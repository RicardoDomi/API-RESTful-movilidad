const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 1000,   // 15s
  max: 3,                    
  message: { 
    message: "Demasiados intentos de login. Intenta más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
