const errorHandler = (err, req, res, next) => {
  if (req.log) {
    req.log.error({ err }, err.message || "Error en la aplicación");
  } else {
    console.error('Error:', err);
  }

  // Errores de Sequelize
  if (err?.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: "Usuario ya registrado" });
  }

  if (err?.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      message: err.errors?.[0]?.message || "Datos inválidos" 
    });
  }

  // Error por defecto del servidor
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;