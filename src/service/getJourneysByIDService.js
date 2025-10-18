const ModelJourney = require("../models/Modeljourney");

const getJourneyByIdService = async (id, userId) => {
  const journey = await ModelJourney.findOne({
    where: { id: id, user_id: userId } 
  });

  if (!journey) {
    throw new Error("Viaje no encontrado o no tienes permiso para verlo");
  }

  return journey;
};

module.exports = { getJourneyByIdService };