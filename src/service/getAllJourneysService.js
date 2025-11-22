const ModelJourney = require("../models/Modeljourney");

exports.getAllJourneys = async (userId) => {
  try {
    const journeys = await ModelJourney.findAll({
      where: { user_id: userId }, 
      attributes: ['id', 'start_location', 'end_location', 'distance', 'duration']
    });

    return journeys;
  } catch (error) {
    throw error;
  }
};