export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};
