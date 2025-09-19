const Modelauth = require('../models/Modelauth');

exports.getUserByEmail = async (email) => {
  return await Modelauth.findOne({
    where: {
      email: email
    }
  });
};