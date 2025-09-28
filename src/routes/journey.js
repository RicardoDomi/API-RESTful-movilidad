const express = require("express");
const router = express.Router();
const journeyController = require("../controller/journeyController");

router.post("/new_journey", journeyController.createJourney);

module.exports = router;