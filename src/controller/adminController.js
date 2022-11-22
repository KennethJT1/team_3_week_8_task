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
exports.getAllAgents = exports.deleteAgent = exports.createAgent = exports.SuperAdmin = exports.AdminRegister = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const agentModel_1 = require("../model/agentModel");
/** ================= Register Admin ===================== **/
const AdminRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const { email, phone, password, fullName, userName, address } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = yield (0, utils_1.GenerateSalt)();
        const adminPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        // Generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // check if the admin exist
        const Admin = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (Admin.email === email) {
            return res.status(400).json({
                message: "Email Already exist",
            });
        }
        if (Admin.phone === phone) {
            return res.status(400).json({
                message: "Phone number  already exist",
            });
        }
        //Create Admin
        if (Admin.role === "superadmin") {
            yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: adminPassword,
                fullName,
                userName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin",
            });
            // check if the admin exist
            const Admin = (yield userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            //Generate signature for user
            let signature = yield (0, utils_1.Generatesignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(201).json({
                message: "Admin created successfully",
                signature,
                verified: Admin.verified,
            });
        }
        return res.status(400).json({
            message: "Admin already exist",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin",
        });
    }
});
exports.AdminRegister = AdminRegister;
/** ================= Super Admin ===================== **/
const SuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, password, fullName, userName, address } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = yield (0, utils_1.GenerateSalt)();
        const adminPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        // Generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // check if the admin exist
        const Admin = (yield userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        //Create Admin
        if (!Admin) {
            yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: adminPassword,
                fullName,
                userName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "superadmin",
            });
            // check if the admin exist
            const Admin = (yield userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate signature for user
            let signature = yield (0, utils_1.Generatesignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(201).json({
                message: " Super Admin created successfully",
                signature,
                verified: Admin.verified,
            });
        }
        return res.status(400).json({
            message: " Super Admin already exist",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin",
        });
    }
});
exports.SuperAdmin = SuperAdmin;
/** ================= Create Agent ===================== **/
const createAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const { name, ownerName, pincode, phone, address, email, password } = req.body;
        const uuidagent = (0, uuid_1.v4)();
        const validateResult = utils_1.agentSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = yield (0, utils_1.GenerateSalt)();
        const agentPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        // check if the Agent exist
        const Agent = (yield agentModel_1.AgentInstance.findOne({
            where: { email: email },
        }));
        const Admin = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (Admin.role === "admin" || Admin.role === "superadmin") {
            if (!Agent) {
                const createAgent = yield agentModel_1.AgentInstance.create({
                    id: uuidagent,
                    name,
                    ownerName,
                    pincode,
                    phone,
                    address,
                    email,
                    password: agentPassword,
                    salt,
                    role: "agent",
                    serviceAvailable: false,
                    rating: 0,
                });
                return res.status(201).json({
                    message: "Agent created successfully",
                    createAgent,
                });
            }
            return res.status(400).json({
                message: "Agent already exist",
            });
        }
        return res.status(400).json({
            message: "unathorised",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-agents",
        });
    }
});
exports.createAgent = createAgent;
/** ==============  Admin Delete Agent ============== **/
const deleteAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const agentid = req.params.agentid;
        const Admin = yield userModel_1.UserInstance.findOne({ where: { id: id } });
        if (Admin.role === "superadmin" || Admin.role === "admin") {
            const deletedAgent = yield agentModel_1.AgentInstance.destroy({ where: { id: agentid } });
            return res.status(201).json({
                message: 'Agent deleted successfully',
                deletedAgent
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/delete-agent"
        });
    }
});
exports.deleteAgent = deleteAgent;
/** =================  AGENT PROFILE ===================== **/
const getAllAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit;
        const agents = yield agentModel_1.AgentInstance.findAndCountAll({
            limit: limit,
        });
        return res.status(200).json({
            message: "You have successfully retrieved all Agents",
            Count: agents.count,
            Users: agents.rows,
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/get-all-agents",
        });
    }
});
exports.getAllAgents = getAllAgents;
