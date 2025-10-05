const ModelJourney = require("../models/Modeljourney");

exports.getAllJourneys = async () => {
    try {
        const journeys = await ModelJourney.findAll();
        return journeys;
    } catch (error) {
        throw error;
    }
};