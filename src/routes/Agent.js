"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middleware/authorization");
const agentController_1 = require("../controller/agentController");
const router = express_1.default.Router();
router.post('/login', agentController_1.agentLogin);
router.post('/create-house', authorization_1.authAgent, agentController_1.createHouse);
router.get('/get-profile', authorization_1.authAgent, agentController_1.AgentProfile);
router.delete('/delete-house/:houseid', authorization_1.authAgent, agentController_1.deleteHouse);
router.patch('/update-house/:houseid', authorization_1.authAgent, agentController_1.updatedHouse);
exports.default = router;
