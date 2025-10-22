const {validationResult} = require('express-validator');
const authService = require('../service/authService');
const jwt = require('jsonwebtoken');
const singupService = require('../service/singupService');

// Función de validación de contraseña fuerte
function isStrongPassword(pwd) {
  return typeof pwd === "string" && pwd.length >= 8;
}

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    
    const user = await authService.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
  
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
    
  } catch (error) {
    // Log con Pino si está disponible, sino console.error
    if (req.log) {
      req.log.error({ err: error }, "Error en login");
    } else {
      console.error('Error en login:', error);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.signupUser = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Validar contraseña fuerte
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const userData = {
      ...req.body
    };

    const signupUser = await singupService.newUser(userData);
    
    // Log con Pino si está disponible
    if (req.log) {
      req.log.info({ userId: signupUser.id }, "Usuario registrado");
    }
    
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: signupUser
    });
  } catch (error) {
    // Log con Pino si está disponible, sino console.error
    if (req.log) {
      req.log.error({ err: error }, "Error en registro");
    } else {
      console.error('Error en registro:', error);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};