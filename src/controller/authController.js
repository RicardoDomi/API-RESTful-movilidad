const {validationResult} = require('express-validator');
const authService = require('../service/authService');
const jwt = require('jsonwebtoken');
const singupService = require('../service/singupService');

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await authService.getUserByEmail(email);
  
  // Validar contraseña (usa el método del modelo si existe, sino comparación directa)
  let passwordValid = false;
  if (typeof user.validPassword === 'function') {
    passwordValid = await user.validPassword(password);
  } else {
    passwordValid = user.password === password;
  }
  
  if (!passwordValid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Log con Pino si está disponible
  if (req.log) {
    req.log.debug({ userId: user.id, email: user.email }, "Login exitoso");
  }

  res.status(200).json({ 
    message: 'Login exitoso',
    user: {
      id: user.id,
      email: user.email,
    },
    token
  });
};

exports.signupUser = async (req, res, next) => {
  const gmail = req.body.gmail || req.body.email;
  const { password, name, username } = req.body;
  const user = await singupService.newUser({ gmail, password, name, username });

  return res.status(201).json({
    message: "Usuario registrado exitosamente",
    user
  });
};