import express,{Request,Response} from 'express';


const router = express.Router()

router.get('/', (req:Request,res:Response)=>{
  res.status(200).send(`WELCOME TO VALUE HOMES CLICK TO VIEW DOCUMENTATION`)
})

export default router;