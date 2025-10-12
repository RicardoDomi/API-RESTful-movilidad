const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { body } = require("express-validator");

const rules = [
  body("username").trim().notEmpty().withMessage("Usuario requerido"),
  body("password").notEmpty().withMessage("Contraseña requerida").isLength({ min: 8 }).withMessage("Minimo 8 caracteres"),
];

router.post("/auth", rules, authController.loginUser);

module.exports = router;
