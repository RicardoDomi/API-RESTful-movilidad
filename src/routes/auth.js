const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { body } = require("express-validator");
const { loginLimiter } = require("../middleware/rateLimit");
const validate = require("../middleware/validate");
const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email es requerido")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email inválido"),
  body("password")
    .notEmpty()
    .withMessage("Contraseña requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

const signupRules = [
  body("gmail")
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Gmail inválido"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email inválido"),
  body("password")
    .notEmpty()
    .withMessage("Contraseña requerida")
    .isString()
    .withMessage("Contraseña debe ser texto")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  body("name")
    .notEmpty()
    .withMessage("Nombre es requerido")
    .trim(),
  body("username")
    .notEmpty()
    .withMessage("Usuario es requerido")
    .trim(),
  body().custom((value, { req }) => {
    if (!req.body.gmail && !req.body.email) {
      throw new Error('Se requiere gmail o email');
    }
    return true;
  })
];

router.post("/",loginRules,validate,loginLimiter,authController.loginUser);
router.post("/signup",signupRules,validate,authController.signupUser)
module.exports = router;
