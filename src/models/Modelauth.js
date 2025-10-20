const { DataTypes } = require("sequelize");
const sequelize = require("../config/Authdatabase");
const { hashPassword, comparePassword } = require("../utils/password");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "users",
  timestamps: true,
  hooks: {
  
    async beforeCreate(user) {
      if (user.password) user.password = await hashPassword(user.password);
    },

    async beforeUpdate(user) {
      if (user.changed("password")) {
        user.password = await hashPassword(user.password);
      }
    }
  }
});

User.prototype.validPassword = function (plain) {
  return comparePassword(plain, this.password);
};

module.exports = User;
