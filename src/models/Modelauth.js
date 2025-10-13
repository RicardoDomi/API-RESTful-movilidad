const { DataTypes } = require('sequelize');
const sequelize = require('../config/Authdatabase');

const User = sequelize.define(
    'User',
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
        }
    },
    {
        tableName: 'users',
        timestamps: false
    }
);

module.exports = User;