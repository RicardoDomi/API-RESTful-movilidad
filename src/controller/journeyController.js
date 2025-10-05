const newJourneyService = require("../service/newJourneyService");
const getAllJourneysService = require("../service/getAllJourneysService");

exports.createJourney = async (req, res) => {
         try {
        const createdJourney = await newJourneyService.createJourney(req.body);
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
        const journeys = await getAllJourneysService.getAllJourneys();
        res.status(200).json({ 
            message: "Viajes obtenidos exitosamente",
            journeys: journeys
        });
    }catch(error){
        res.status(500).json({ error: "Error al obtener los viajes" });
    }
}