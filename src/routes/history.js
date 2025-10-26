const { Router } = require("express");
const { body, param } = require("express-validator");
const controller = require("../controller/historyController");

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


router.get(
  "/:userId",
  [param("userId").isInt({ min: 1 })],
  controller.getUserHistory
);


router.post(
  "/:userId",
  [
    param("userId").isInt({ min: 1 }),
    body("originLat").isFloat().withMessage("originLat inválido"),
    body("originLng").isFloat().withMessage("originLng inválido"),
    body("destinationLat").isFloat().withMessage("destinationLat inválido"),
    body("destinationLng").isFloat().withMessage("destinationLng inválido"),

  ],
  controller.createRouteHistory
);


router.delete(
  "/:userId/:id",
  [param("userId").isInt({ min: 1 }), param("id").isInt({ min: 1 })],
  controller.deleteRouteHistory
);

module.exports = router;
