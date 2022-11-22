import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  adminSchema,
  GenerateOTP,
  GeneratePassword,
  GenerateSalt,
  Generatesignature,
  option,
  agentSchema,
} from "../utils";

import { UserAttributes, UserInstance } from "../model/userModel";

import { v4 as uuidv4 } from "uuid";
import { AgentAttributes, AgentInstance } from "../model/agentModel";

/** ================= Register Admin ===================== **/
export const AdminRegister = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { email, phone, password, fullName, userName, address } = req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const adminPassword = await GeneratePassword(password, salt);

    // Generate OTP
    const { otp, expiry } = GenerateOTP();

    // check if the admin exist
    const Admin = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

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
      await UserInstance.create({
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
      const Admin = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;

      //Generate signature for user
      let signature = await Generatesignature({
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
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-admin",
    });
  }
};

/** ================= Super Admin ===================== **/
export const SuperAdmin = async (req: JwtPayload, res: Response) => {
  try {
    const { email, phone, password, fullName, userName, address } = req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const adminPassword = await GeneratePassword(password, salt);

    // Generate OTP
    const { otp, expiry } = GenerateOTP();

    // check if the admin exist
    const Admin = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;

    //Create Admin
    if (!Admin) {
      await UserInstance.create({
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
      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;

      //Generate signature for user
      let signature = await Generatesignature({
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
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-admin",
    });
  }
};

/** ================= Create Agent ===================== **/
export const createAgent = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { name, ownerName, pincode, phone, address, email, password } =
      req.body;
    const uuidagent = uuidv4();
    const validateResult = agentSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const agentPassword = await GeneratePassword(password, salt);

    // check if the Agent exist
    const Agent = (await AgentInstance.findOne({
      where: { email: email },
    })) as unknown as AgentAttributes;

    const Admin = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    if (Admin.role === "admin" || Admin.role === "superadmin") {
      if (!Agent) {
        const createAgent = await AgentInstance.create({
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
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-agents",
    });
  }
};


/** ==============  Admin Delete Agent ============== **/
export const deleteAgent = async(req:JwtPayload,res:Response)=>{
  try{
    const id = req.user.id;
    const agentid = req.params.agentid
    const Admin = await UserInstance.findOne({where:{id:id}}) as unknown as UserAttributes
if(Admin.role === "superadmin"|| Admin.role === "admin"){
 
   const deletedAgent = await AgentInstance.destroy({where:{id:agentid}}) 
   return res.status(201).json({
    message:'Agent deleted successfully', 
   deletedAgent
  })

}
  }catch(err){
    res.status(500).json({
      Error:"Internal server Error",
      route:"/admins/delete-agent"
    });
  }
}


/** =================  AGENT PROFILE ===================== **/

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit as number | undefined;
    const agents = await AgentInstance.findAndCountAll({
      limit: limit,
    });
    return res.status(200).json({
      message: "You have successfully retrieved all Agents",
      Count: agents.count,
      Users: agents.rows,
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/get-all-agents",
    });
  }
};