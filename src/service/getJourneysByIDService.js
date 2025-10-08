const ModelJourney = require("../models/Modeljourney");

const getJourneyByIdService = async (id) => {
  const journey = await ModelJourney.findByPk(id);
  if (!journey) {
    throw new Error("Viaje no encontrado");
  }

  return journey;
};

module.exports = { getJourneyByIdService };