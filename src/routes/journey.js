const express = require("express");
const router = express.Router();
const journeyController = require("../controller/journeyController");

router.post("/new_journey", journeyController.createJourney);
router.get("/all_journeys", journeyController.getAllJourneys);
router.get("/journey/:id", journeyController.getJourneyById);

module.exports = router;