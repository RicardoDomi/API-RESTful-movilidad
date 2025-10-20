const express = require("express");
const { register, login } = require("../controller/authController");
const { loginLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login); 

module.exports = router;
