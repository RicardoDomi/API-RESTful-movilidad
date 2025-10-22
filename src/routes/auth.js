const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { body } = require("express-validator");
const { loginLimiter } = require("../middleware/rateLimit");

const rules = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña requerida").isLength({ min: 8 }).withMessage("Minimo 8 caracteres"),
];

router.post("/",rules,loginLimiter,authController.loginUser);
router.post("/sing-up",authController.signupUser)
module.exports = router;
