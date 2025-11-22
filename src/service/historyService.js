
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
    order: [["usedAt", "DESC"]],});
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

exports.updateHistory = async (userId,id,data) => {
  const history = await Modelhistory.findOne({
    where :{id , userId, isDeleted: false},
  });
  if (!history){
    return null;
  }
   const allowedFields = [
    "originLat",
    "originLng",
    "destinationLat",
    "destinationLng",
    "distanceM",
    "durationS",
    "mode",
    "usedAt",
    "metadata",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  
  if (Object.keys(updates).length === 0) {
    return history;
  }

  await history.update(updates);
  return history;
};
