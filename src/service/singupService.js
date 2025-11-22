const Modelauth = require("../models/Modelauth");

exports.newUser = async (userData)=>{
    try{
        const newUser = await Modelauth.create(userData);
        return newUser;
    } catch(error){
    throw error;
    }
};