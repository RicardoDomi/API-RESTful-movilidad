
const sequelize = require("../config/Authdatabase");
const Modelhistory = require("../models/Modelhistory")(sequelize);


exports.getHistoryByUser = async (userId) => {
  return Modelhistory.findAll({
    attributes: [
      "id",
      "originLat", "originLng",
      "destinationLat", "destinationLng",
      "distanceM", "durationS",
      "mode", "usedAt", "metadata"
    ],
    where: { userId, isDeleted: false },
    order: [["usedAt", "DESC"]],
  });
};


exports.createHistory = async (userId, data) => {
  return Modelhistory.create({
    userId,
    originLat: data.originLat,
    originLng: data.originLng,
    destinationLat: data.destinationLat,
    destinationLng: data.destinationLng,
    distanceM: data.distanceM ?? null,
    durationS: data.durationS ?? null,
    mode: data.mode || "car",
    usedAt: data.usedAt || new Date(),
    metadata: data.metadata || null,
  });
};


exports.deleteHistory = async (userId, id) => {
  const [affected] = await Modelhistory.update(
    { isDeleted: true },
    { where: { id, userId, isDeleted: false } }
  );
  return affected > 0;
};
