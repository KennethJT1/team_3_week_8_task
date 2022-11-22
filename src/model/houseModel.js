"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class HouseInstance extends sequelize_1.Model {
}
exports.HouseInstance = HouseInstance;
HouseInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    condition: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    propertySize: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true
    },
    rating: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true
    },
    agentId: {
        type: sequelize_1.DataTypes.UUIDV4,
        allowNull: true
    },
}, {
    sequelize: config_1.db,
    tableName: 'house'
});
