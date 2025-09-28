const ModelJourney = require("../models/Modeljourney");

exports.createJourney = async (journeyData)=>{
    try{
        const newJourney = await ModelJourney.create(journeyData);
        return newJourney;
    } catch(error){
    throw error;
    }
};