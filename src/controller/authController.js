const Modelauth = require('../models/Modelauth');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Modelauth.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};