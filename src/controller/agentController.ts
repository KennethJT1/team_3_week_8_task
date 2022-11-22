import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AgentAttributes, AgentInstance } from "../model/agentModel";
import {
  Generatesignature,
  loginSchema,
  option,
  updateHouseSchema,
  updateSchema,
  validatePassword,
} from "../utils";
import { HouseAttributes, HouseInstance } from "../model/houseModel";
import { v4 as uuidv4 } from "uuid";

/** ================= Agent Login ===================== **/
export const agentLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // check if the agent exist
    const Agent = (await AgentInstance.findOne({
      where: { email: email },
    })) as unknown as AgentAttributes;

    if (Agent) {
      const validation = await validatePassword(
        password,
        Agent.password,
        Agent.salt
      );
      console.log(validation)
      if (validation) {
        //Generate signature for agent
        let signature = await Generatesignature({
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
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/agents/login",
    });
  }
};

/** =================Agent Add House ===================== **/

export const createHouse = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.agent.id;
    const {   name, 
      address,
     description,
     category,
     propertySize,
     condition, price } =
      req.body;

    // check if the agent exist
    const Agent = (await AgentInstance.findOne({
      where: { id: id },
    })) as unknown as AgentAttributes;
    const houseid = uuidv4();
    if (Agent) {
      const createhouse = await HouseInstance.create({
        id: houseid,
       name, 
       address,
      description,
      category,
      propertySize,
      condition,
      price,
      rating:0,
      agentId: id
      });

      return res.status(201).json({
        message: "House added successfully",
        createhouse,
      });
    }
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/agents/create-house",
    });
  }
};


/** ============== Get Agent profile ============== **/
export const AgentProfile = async(req:JwtPayload,res:Response)=>{
  try{
    const id = req.agent.id
    const Agent = await AgentInstance.findOne({where:{id:id},
      attributes:["id","name","ownerName","address","phone","pincode","email","rating"],
      include:[{model:HouseInstance, as:"house", 
      attributes:["id","name","description","category","condition","propertySize","price","rating","agentId"]}]}) as unknown as AgentAttributes

    return res.status(200).json({
     Agent
  })
  }catch(err){
    res.status(500).json({
      Error:"Internal server Error",
      route:"/agents/get-profile"
    });
  }
}

/** ==============  Agent  Delete House ============== **/
export const deleteHouse = async(req:JwtPayload,res:Response)=>{
  try{
    const id = req.agent.id;
    const houseid = req.params.houseid
    const Agent = await AgentInstance.findOne({where:{id:id}}) as unknown as AgentAttributes
if(Agent){
 
   const deletedHouse = await HouseInstance.destroy({where:{id:houseid}}) 
   return res.status(201).json({
    message:'House deleted successfully', 
   deletedHouse
  })

}
  }catch(err){
    res.status(500).json({
      Error:"Internal server Error",
      route:"/agents/delete-house"
    });
  }
}

/** ==============  Agent  Update House ============== **/
export const updatedHouse = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.agent.id;
    const houseid = req.params.houseid;
    const { name,  description, address,  category, propertySize, condition,price} = req.body;
    //Joi validation
    const validateResult = updateHouseSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // check if the agent 
    const Agent = (await AgentInstance.findOne({
      where: { id: id },
    })) as unknown as AgentAttributes;

    if (!Agent) {
      return res.status(400).json({
        Error: "You are not authorized to update your profile",
      });
    }

    const updatedHouse = (await HouseInstance.update(
      {
        name,
        address,
        description,
        category,
        propertySize,
        condition,
        price,
        
      },
      { where: { id: houseid } }
    )) as unknown as HouseAttributes;

    if (updatedHouse) {
      const House = (await HouseInstance.findOne({
        where: { id: houseid },
      })) as unknown as HouseAttributes;
      return res.status(200).json({
        message: "You have successfully updated your profile",
       House
      });
    }
    return res.status(400).json({
      message: "Error occured",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/update-house",
    });
  }
};
