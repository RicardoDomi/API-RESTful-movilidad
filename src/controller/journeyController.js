const newJourneyService = require("../service/newJourneyService");
const getAllJourneysService = require("../service/getAllJourneysService");
const {getJourneyByIdService} = require("../service/getJourneysByIDService");
const status = require('http-status')

exports.createJourney = async (req, res) => {
        const journeyData = {
            ...req.body,
            user_id: req.userId
        };
        const createdJourney = await newJourneyService.createJourney(journeyData);
        res.status(201).json({
            message: "Viaje creado exitosamente",
            journey: createdJourney
        });
}
exports.getAllJourneys = async (req, res) => {
        const journeys = await getAllJourneysService.getAllJourneys(req.userId);
        res.status(200).json({ 
            message: "Viajes obtenidos exitosamente",
            journeys: journeys
        });
}

exports.getJourneyById = async (req, res) => {

    const { id } = req.params;
    const journey = await getJourneyByIdService(id, req.userId);
    res.status(200).json({
      message: "Viaje obtenido exitosamente",
      journey: journey
    });
};
