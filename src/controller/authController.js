const { validationResult } = require('express-validator');
const authService = require('../service/authService');

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // devuelve mensajes de validación al front
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    const user = await authService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // En esta demo no hay hashing; compara en texto plano
    if (user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    return res.status(200).json({
      message: 'Login exitoso',
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
