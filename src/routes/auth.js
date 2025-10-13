const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { body } = require("express-validator");
const rules = [
  body("email")
    .notEmpty()
    .withMessage("Campo vacio")
    .normalizeEmail()
    .isEmail()
    .withMessage("Email invalido"),
  body("password")
    .notEmpty()
    .withMessage("Campo vacio")
    .isLength({ min: 8 })
    .withMessage("Minimo 8 caracteres"),
];

router.post("/",rules, authController.loginUser);

module.exports = router;
