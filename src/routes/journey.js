const express = require("express");
const router = express.Router();
const journeyController = require("../controller/journeyController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/new_journey", verifyToken, journeyController.createJourney);
router.get("/all_journeys", verifyToken, journeyController.getAllJourneys);
router.get("/journey/:id", verifyToken, journeyController.getJourneyById);

module.exports = router;