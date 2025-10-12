const Modelauth = require('../models/Modelauth');

exports.getUserByUsername = async (username) => {
  return await Modelauth.findOne({
    where: { username }
  });
};
