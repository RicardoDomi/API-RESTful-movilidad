const { Router } = require("express");
const { body, param } = require("express-validator");
const controller = require("../controller/historyController");
const appikey = require("../middleware/middlewareHistory");

const router = Router();


router.param("userId", (req, res, next, val) => {
  const num = Number.parseInt(String(val).trim(), 10);
  if (!Number.isInteger(num) || num <= 0) {
    return res.status(400).json({ error: "userId inválido" });
  }
  req.params.userId = num;
  next();
});
router.param("id", (req, res, next, val) => {
  if (val === undefined) return next();
  const num = Number.parseInt(String(val).trim(), 10);
  if (!Number.isInteger(num) || num <= 0) {
    return res.status(400).json({ error: "id inválido" });
  }
  req.params.id = num;
  next();
});

/**
 * @swagger
 * /history/{userId}:
 *   get:
 *     tags: [History]
 *     summary: Obtener historial de rutas de un usuario
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       200:
 *         description: Lista de rutas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Historial obtenido correctamente" }
 *                 history:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/RouteHistory' }
 *       400:
 *         description: Parámetros inválidos
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
 *       404:
 *         description: Sin registros
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
 */

router.get("/:userId",[param("userId").isInt({ min: 1 })],
       appikey,
 controller.getUserHistory
);
/**
 * @swagger
 * /history/{userId}:
 *   post:
 *     tags: [History]
 *     summary: Crear un nuevo registro de historial de ruta
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRouteHistoryRequest' }
 *     responses:
 *       201:
 *         description: Ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Ruta creada correctamente" }
 *                 route: { $ref: '#/components/schemas/RouteHistory' }
 *       400:
 *         description: Body inválido
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
 *       500:
 *         description: Error interno
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
 */

router.post( "/:userId",[ 
    appikey,
    param("userId").isInt({ min: 1 }),
    body("originLat").isFloat().withMessage("originLat inválido"),
    body("originLng").isFloat().withMessage("originLng inválido"),
    body("destinationLat").isFloat().withMessage("destinationLat inválido"),
    body("destinationLng").isFloat().withMessage("destinationLng inválido"),
   ],
  controller.createRouteHistory
);


router.put(

  "/:userId/:id",
  appikey,   // ← OBLIGATORIO
  [
    param("userId").isInt({ min: 1 }).withMessage("userId debe ser un entero positivo"),
    param("id").isInt({ min: 1 }).withMessage("id debe ser un entero positivo"),

    body("originLat").optional().isFloat(),
    body("originLng").optional().isFloat(),
    body("destinationLat").optional().isFloat(),
    body("destinationLng").optional().isFloat(),
    body("distanceM").optional().isInt({ min: 0 }),
    body("durationS").optional().isInt({ min: 0 }),
    body("mode").optional().isString(),
    body("usedAt").optional().isISO8601(),
    body("metadata").optional().isObject(),
  ],
    // ← OBLIGATORIO
  controller.updateRouteHistory   
);

/**
 * @swagger
 * /history/{userId}/{id}:
 *   delete:
 *     tags: [History]
 *     summary: Eliminar un registro de historial
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *       - $ref: '#/components/parameters/HistoryIdParam'
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Ruta eliminada correctamente" }
 *       404:
 *         description: No encontrado
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
 *       400:
 *         description: Parámetros inválidos
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
 */
router.delete(
 "/:userId/:id",
 appikey,
  [param("userId").isInt({ min: 1 }), param("id").isInt({ min: 1 })],
  controller.deleteRouteHistory
);




module.exports = router;
