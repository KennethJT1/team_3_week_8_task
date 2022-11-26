import express from "express";
import {auth} from '../middleware/authorization'
import { AdminRegister,createAgent,deleteAgent,getAllAgents,SuperAdmin } from "../controller/adminController";

const router = express.Router();

router.post('/create-super-admin',SuperAdmin)
router.post('/create-admin', auth, AdminRegister)
router.post('/create-agents', auth, createAgent)
router.delete('/delete-agent/:agentid', auth, deleteAgent)
router.get('/get-all-agents', auth,  getAllAgents)

export default router;