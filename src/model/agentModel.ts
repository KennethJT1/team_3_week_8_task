import { DataTypes, Model } from "sequelize";
import {db} from '../config'
import {  HouseInstance } from "./houseModel";

export interface  AgentAttributes {
  id: string;
  name: string;
  ownerName: string;
  pincode:string;
  phone: string;
  address: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable:boolean;
  rating:number;
  role:string
}

export class AgentInstance extends Model<AgentAttributes> {}

AgentInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Email address is required",
          },
          isEmail: {
            msg: "please provide a valid email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password is required",
          },
          notEmpty: {
            msg: "provide a password",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ownerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salt: {
          type:DataTypes.STRING,
          allowNull:false,
      },
      address:{
          type:DataTypes.STRING,
          allowNull:true
      },
      phone:{
          type:DataTypes.STRING,
          allowNull:false,
          validate: {
            notNull: {
              msg: "Phone number is required",
            },
            notEmpty: {
              msg: "provide a phone number",
            },
          }
      },
      pincode:{
          type:DataTypes.STRING,
          allowNull:true
      },
      serviceAvailable:{
          type:DataTypes.BOOLEAN,
          allowNull:true
      },
      rating:{
          type:DataTypes.NUMBER,
          allowNull:true
      },

    role:{
      type:DataTypes.STRING,
      allowNull:true
  },
    
},

{
    sequelize:db,
    tableName:'agent'
});


AgentInstance.hasMany(HouseInstance, {foreignKey:'agentId', as:'house'});

HouseInstance.belongsTo(AgentInstance, {foreignKey:'agentId', as:'agent' } );