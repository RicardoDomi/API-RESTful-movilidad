const { validationResult } = require("express-validator");
const historyService = require("../service/historyService");

// GET /history/:userId
exports.getUserHistory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.params.userId; // ya viene saneado y como int por router.param
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }

  const history = await historyService.getHistoryByUser(userId);
  if (!history.length) return res.status(404).json({ message: "No se encontraron rutas para este usuario" });

  res.status(200).json({ message: "Historial obtenido correctamente", history });
};

// POST /history/:userId
exports.createRouteHistory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.params.userId; // int sano
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }

  const route = await historyService.createHistory(userId, req.body);
  res.status(201).json({ message: "Ruta creada correctamente", route });
};

// DELETE /history/:userId/:id
exports.deleteRouteHistory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.params.userId;
  const id = req.params.id;
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id inválido" });
  }

  const deleted = await historyService.deleteHistory(userId, id);
  if (!deleted) return res.status(404).json({ message: "Ruta no encontrada o ya eliminada" });
  res.status(200).json({ message: "Ruta eliminada correctamente" });
};
