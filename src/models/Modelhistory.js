const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Modelhistory = sequelize.define(
    "Modelhistory",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      userId: { field: "user_id", type: DataTypes.BIGINT, allowNull: false },

      originLat: { field: "origin_lat", type: DataTypes.DECIMAL(10, 7), allowNull: false },
      originLng: { field: "origin_lng", type: DataTypes.DECIMAL(10, 7), allowNull: false },
      destinationLat: { field: "destination_lat", type: DataTypes.DECIMAL(10, 7), allowNull: false },
      destinationLng: { field: "destination_lng", type: DataTypes.DECIMAL(10, 7), allowNull: false },

      distanceM: { field: "distance_m", type: DataTypes.FLOAT },
      durationS: { field: "duration_s", type: DataTypes.INTEGER },

      mode: {
        type: DataTypes.ENUM("car", "bike", "walk", "transit"),
        defaultValue: "car",
      },

      usedAt: { field: "used_at", type: DataTypes.DATE, defaultValue: DataTypes.NOW },

      metadata: { type: DataTypes.JSON, allowNull: true },
      isDeleted: { field: "is_deleted", type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "route_history",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { name: "idx_user_usedat", fields: ["user_id", "used_at"] },
        { name: "idx_user_deleted", fields: ["user_id", "is_deleted"] },
      ],
    }
  );

  return Modelhistory;
};
