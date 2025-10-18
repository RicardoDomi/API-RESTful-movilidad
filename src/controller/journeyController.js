const newJourneyService = require("../service/newJourneyService");
const getAllJourneysService = require("../service/getAllJourneysService");
const {getJourneyByIdService} = require("../service/getJourneysByIDService");

exports.createJourney = async (req, res) => {
         try {
        const journeyData = {
            ...req.body,
            userId: req.userId
        };
        const createdJourney = await newJourneyService.createJourney(journeyData);
        res.status(201).json({
            message: "Viaje creado exitosamente",
            journey: createdJourney
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el viaje" });
    }
}
exports.getAllJourneys = async (req, res) => {
    try{
        const journeys = await getAllJourneysService.getAllJourneys(req.userId);
        res.status(200).json({ 
            message: "Viajes obtenidos exitosamente",
            journeys: journeys
        });
    }catch(error){
        res.status(500).json({ error: "Error al obtener los viajes" });
    }
}

exports.getJourneyById = async (req, res) => {
  try {
    const { id } = req.params;
    const journey = await getJourneyByIdService(id, req.userId);
    res.status(200).json({
      message: "Viaje obtenido exitosamente",
      journey: journey
    });
  } catch (error) {
    res.status(404).json({ error: error.message || "Error al obtener el viaje" });
  }
};