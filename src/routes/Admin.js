"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middleware/authorization");
const adminController_1 = require("../controller/adminController");
const router = express_1.default.Router();
router.post('/create-admin', authorization_1.auth, adminController_1.AdminRegister);
router.post('/create-super-admin', adminController_1.SuperAdmin);
router.post('/create-agents', authorization_1.auth, adminController_1.createAgent);
router.delete('/delete-agent/:agentid', authorization_1.auth, adminController_1.deleteAgent);
router.get('/get-all-agents', authorization_1.auth, adminController_1.getAllAgents);
exports.default = router;