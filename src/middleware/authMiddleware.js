const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

  if (process.env.DEMO_MODE === "true") {
    console.log(" Modo DEMO: autenticación desactivada");
    req.userId = 1; 
    return next();
  }

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = verifyToken;
