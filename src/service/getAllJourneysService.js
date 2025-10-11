const ModelJourney = require("../models/Modeljourney");

exports.getAllJourneys = async () => {
    try {
        const journeys = await ModelJourney.findAll({
            attributes: ['id', 'start_location', 'end_location', 'distance', 'duration']
        });

        return journeys;
    } catch (error) {
        throw error;
    }
};