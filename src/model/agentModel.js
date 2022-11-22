"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const houseModel_1 = require("./houseModel");
class AgentInstance extends sequelize_1.Model {
}
exports.AgentInstance = AgentInstance;
AgentInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email address is required",
            },
            isEmail: {
                msg: "please provide a valid email",
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "password is required",
            },
            notEmpty: {
                msg: "provide a password",
            },
        },
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ownerName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Phone number is required",
            },
            notEmpty: {
                msg: "provide a phone number",
            },
        }
    },
    pincode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    serviceAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    },
    rating: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: config_1.db,
    tableName: 'agent'
});
AgentInstance.hasMany(houseModel_1.HouseInstance, { foreignKey: 'agentId', as: 'house' });
houseModel_1.HouseInstance.belongsTo(AgentInstance, { foreignKey: 'agentId', as: 'agent' });
