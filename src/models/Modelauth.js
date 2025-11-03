const { DataTypes } = require('sequelize');
const sequelize = require('../config/Authdatabase');
const { hashPassword, comparePassword } = require("../utils/password");

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
   
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user"
    }
  },
  {
    tableName: 'users',
    timestamps: false,
    hooks: {
      async beforeCreate(userInstance) {
        if (userInstance.password) {
          userInstance.password = await hashPassword(userInstance.password);
        }
      },
      async beforeUpdate(userInstance) {
        if (userInstance.changed("password")) {
          userInstance.password = await hashPassword(userInstance.password);
        }
      }
    }
  }
);

User.prototype.validPassword = async function (plainPassword) {
  return await comparePassword(plainPassword, this.password);
};

module.exports = User;
