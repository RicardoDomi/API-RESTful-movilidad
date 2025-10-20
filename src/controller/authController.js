const jwt = require("jsonwebtoken");
const User = require("../models/Modelauth");

// Reusamos el logger creado en index.js vía req.log (de pino-http)
function isStrongPassword(pwd) {
  return typeof pwd === "string" && pwd.length >= 8;
}

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "username y password son obligatorios" });

    if (!isStrongPassword(password))
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });

    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(409).json({ message: "El usuario ya existe" });

    const user = await User.create({ username, email, password });

    // pino-http inyecta req.log
    req.log.info({ userId: user.id, username }, "Usuario registrado");
    return res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    req.log.error({ err: error }, "Error en register");
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: "Usuario o contraseña inválidos" });

    const ok = await user.validPassword(password);
    if (!ok) return res.status(400).json({ message: "Usuario o contraseña inválidos" });

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    req.log.debug({ userId: user.id, username }, "Login exitoso");
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    req.log.error({ err: error }, "Error en login");
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

module.exports = { register, login };
