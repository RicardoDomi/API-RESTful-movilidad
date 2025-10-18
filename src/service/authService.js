const Modelauth = require('../models/Modelauth');


exports.getUserByEmail = async (email) => {
    try {
        return await Modelauth.findOne({ 
            where: { gmail: email } 
        });
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

exports.getUserByUsername = async (username) => {
  return await Modelauth.findOne({
    where: { username }
  });
};

