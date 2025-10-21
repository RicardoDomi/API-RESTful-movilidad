const Modelauth = require('../models/Modelauth');
const status = require('http-status')

exports.getUserByEmail = async (email) => {
    try {
        return await Modelauth.findOne({ 
            where: { gmail: email } 
        });
    } catch (error) {
        console.error('Error en login:');
        throw error;
    }
};

exports.getUserByUsername = async (username) => {
  return await Modelauth.findOne({
    where: { username }
  });
};

