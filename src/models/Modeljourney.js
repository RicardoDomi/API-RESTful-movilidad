const {DataTypes} = require('sequelize');
const sequelize = require('../config/Authdatabase');

const ModelJourney = sequelize.define(
    'journeys',{
        id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
        start_location:{type: DataTypes.STRING, allowNull:false},
        end_location:{type: DataTypes.STRING, allowNull:false},
        distance:{type: DataTypes.FLOAT,allowNull:false},
        duration:{type: DataTypes.FLOAT,allowNull:false},
        date_time:{type: DataTypes.DATE,allowNull:false},
        route_points: {type: DataTypes.JSON},                         
        is_popular: {type: DataTypes.BOOLEAN, defaultValue: false},    
        rating: {type: DataTypes.FLOAT, defaultValue: 0},              
        usage_count: {type: DataTypes.INTEGER, defaultValue: 0},
    },{
        timestamps:true
    }
)

module.exports = ModelJourney;