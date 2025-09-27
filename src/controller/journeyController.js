const newJourneyService = require("../service/newJourneyService");

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