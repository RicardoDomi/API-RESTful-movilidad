const { validationResult } = require("express-validator");
const historyService = require("../service/historyService");

// GET /history/:userId
exports.getUserHistory = async (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }

  const history = await historyService.getHistoryByUser(userId);

  if (!history.length) {
    return res.status(404).json({
      message: "No se encontraron rutas para este usuario",
    });
  }

  return res.status(200).json({
    message: "Historial obtenido correctamente",
    history,
  });
};


// POST /history/:userId
exports.createRouteHistory = async (req, res, next) => {
  // SOLO si agregaste validators en la ruta
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const userId = parseInt(req.params.userId, 10);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }

  const route = await historyService.createHistory(userId, req.body);

  return res.status(201).json({
    message: "Ruta creada correctamente",
    route,
  });
};


// DELETE /history/:userId/:id
exports.deleteRouteHistory = async (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  const id = parseInt(req.params.id, 10);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id inválido" });
  }

  const deleted = await historyService.deleteHistory(userId, id);

  if (!deleted) {
    return res.status(404).json({
      message: "Ruta no encontrada o ya eliminada",
    });
  }

  return res.status(200).json({
    message: "Ruta eliminada",
  });
};


// PUT /history/:userId/:id
exports.updateRouteHistory = async (req, res, next) => {
  // SOLO si la ruta tiene validators
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const userId = parseInt(req.params.userId, 10);
  const id = parseInt(req.params.id, 10);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id inválido" });
  }

  const updated = await historyService.updateHistory(userId, id, req.body);

  if (!updated) {
    return res.status(404).json({
      message: "Ruta no encontrada",
    });
  }

  return res.status(200).json({
    message: "Ruta actualizada correctamente",
    route: updated,
  });
};
