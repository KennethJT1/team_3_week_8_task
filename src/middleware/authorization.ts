import {Request, Response,NextFunction} from 'express'
import jwt,{JwtPayload} from 'jsonwebtoken'
import {APP_SECRET} from "../config"
import { UserAttributes, UserInstance } from '../model/userModel'
import { AgentAttributes, AgentInstance } from '../model/agentModel'

export const auth = async(req:JwtPayload , res:Response, next:NextFunction)=>{
try{
    const authorization = req.headers.authorization

    if(!authorization){
        return res.status(401).json({
            Error:"Kindly login"
        })
    }
   // Bearer erryyyygccffxfx
   const token = authorization.slice(7, authorization.length);
    let verified = jwt.verify(token,APP_SECRET) 

    if(!verified){
        return res.status(401).json({
            Error:"unauthorised"
        })
    }
   
  
    const {id} = verified as {[key:string]:string}

     // find the user by id
     const user = (await UserInstance.findOne({
        where: { id: id},
      })) as unknown as UserAttributes;

     if(!user){
        return res.status(401).json({
            Error:"Invalid Credentials"
        })
     } 

   req.user = verified;
   next()
}catch(err){
    return res.status(401).json({
        Error:"unauthorised"
    })
}
}


export const authAgent = async(req:JwtPayload , res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
    
        if(!authorization){
            return res.status(401).json({
                Error:"Kindly login"
            })
        }
       // Bearer erryyyygccffxfx
       const token = authorization.slice(7, authorization.length);
        let verified = jwt.verify(token,APP_SECRET) 
    
        if(!verified){
            return res.status(401).json({
                Error:"unauthorised"
            })
        }
       
      
        const {id} = verified as {[key:string]:string}
    
         // find the agent by id
         const agent = (await AgentInstance.findOne({
            where: { id: id},
          })) as unknown as AgentAttributes;
    
         if(!agent){
            return res.status(401).json({
                Error:"Invalid Credentials"
            })
         } 
    
       req.agent= verified;
       next()
    }catch(err){
        return res.status(401).json({
            Error:"unauthorised"
        })
    }
    }