const {DataTypes} = require('sequelize');
const sequelize = require('../config/Authdatabase');

const Modelauth = sequelize.define(
  'auth',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
    username:{type: DataTypes.STRING, allowNull:false},
    password:{type: DataTypes.STRING, allowNull:false}
  },{
    timestamps:false
  }
);

module.exports = Modelauth;
