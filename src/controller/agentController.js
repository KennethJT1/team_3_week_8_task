"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedHouse = exports.deleteHouse = exports.AgentProfile = exports.createHouse = exports.agentLogin = void 0;
const agentModel_1 = require("../model/agentModel");
const utils_1 = require("../utils");
const houseModel_1 = require("../model/houseModel");
const uuid_1 = require("uuid");
/** ================= Agent Login ===================== **/
const agentLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // check if the agent exist
        const Agent = (yield agentModel_1.AgentInstance.findOne({
            where: { email: email },
        }));
        if (Agent) {
            const validation = yield (0, utils_1.validatePassword)(password, Agent.password, Agent.salt);
            console.log(validation);
            if (validation) {
                //Generate signature for agent
                let signature = yield (0, utils_1.Generatesignature)({
                    id: Agent.id,
                    email: Agent.email,
                    serviceAvailable: Agent.serviceAvailable,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: Agent.email,
                    serviceAvailable: Agent.serviceAvailable,
                    role: Agent.role,
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong Username or password or not a verified agent ",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/agents/login",
        });
    }
});
exports.agentLogin = agentLogin;
/** =================Agent Add House ===================== **/
const createHouse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.agent.id;
        const { name, address, description, category, propertySize, condition, price } = req.body;
        // check if the agent exist
        const Agent = (yield agentModel_1.AgentInstance.findOne({
            where: { id: id },
        }));
        const houseid = (0, uuid_1.v4)();
        if (Agent) {
            const createhouse = yield houseModel_1.HouseInstance.create({
                id: houseid,
                name,
                address,
                description,
                category,
                propertySize,
                condition,
                price,
                rating: 0,
                agentId: id
            });
            return res.status(201).json({
                message: "House added successfully",
                createhouse,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/agents/create-house",
        });
    }
});
exports.createHouse = createHouse;
/** ============== Get Agent profile ============== **/
const AgentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.agent.id;
        const Agent = yield agentModel_1.AgentInstance.findOne({ where: { id: id },
            attributes: ["id", "name", "ownerName", "address", "phone", "pincode", "email", "rating"],
            include: [{ model: houseModel_1.HouseInstance, as: "house",
                    attributes: ["id", "name", "description", "category", "condition", "propertySize", "price", "rating", "agentId"] }] });
        return res.status(200).json({
            Agent
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/agents/get-profile"
        });
    }
});
exports.AgentProfile = AgentProfile;
/** ==============  Agent  Delete House ============== **/
const deleteHouse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.agent.id;
        const houseid = req.params.houseid;
        const Agent = yield agentModel_1.AgentInstance.findOne({ where: { id: id } });
        if (Agent) {
            const deletedHouse = yield houseModel_1.HouseInstance.destroy({ where: { id: houseid } });
            return res.status(201).json({
                message: 'House deleted successfully',
                deletedHouse
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/agents/delete-house"
        });
    }
});
exports.deleteHouse = deleteHouse;
/** ==============  Agent  Update House ============== **/
const updatedHouse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.agent.id;
        const houseid = req.params.houseid;
        const { name, description, address, category, propertySize, condition, price } = req.body;
        //Joi validation
        const validateResult = utils_1.updateHouseSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // check if the agent 
        const Agent = (yield agentModel_1.AgentInstance.findOne({
            where: { id: id },
        }));
        if (!Agent) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        const updatedHouse = (yield houseModel_1.HouseInstance.update({
            name,
            address,
            description,
            category,
            propertySize,
            condition,
            price,
        }, { where: { id: houseid } }));
        if (updatedHouse) {
            const House = (yield houseModel_1.HouseInstance.findOne({
                where: { id: houseid },
            }));
            return res.status(200).json({
                message: "You have successfully updated your profile",
                House
            });
        }
        return res.status(400).json({
            message: "Error occured",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/update-house",
        });
    }
});
exports.updatedHouse = updatedHouse;
