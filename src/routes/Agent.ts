import express from "express";
import {authAgent} from '../middleware/authorization'
import {createHouse, agentLogin, deleteHouse, AgentProfile, updatedHouse} from "../controller/agentController";

const router = express.Router();
router.post('/login',agentLogin)
router.post('/create-house',authAgent,createHouse)
router.get('/get-profile',authAgent,AgentProfile)
router.delete('/delete-house/:houseid',authAgent,deleteHouse)
router.patch('/update-house/:houseid',authAgent,updatedHouse)

export default router;