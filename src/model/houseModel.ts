import { DataTypes, Model } from "sequelize";
import {db} from '../config'

export interface HouseAttributes {
  id: string;
  name: string;
  address:string;
  description: string;
  category:string;
  propertySize: string;
  condition:string;
  price: number;
  rating:number;
  agentId:string;
}

export class HouseInstance extends Model<HouseAttributes> {}

HouseInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
          type:DataTypes.STRING,
          allowNull:false,
      },
      address:{
          type:DataTypes.STRING,
          allowNull:true
      },
      
      condition:{
          type:DataTypes.STRING,
          allowNull:true
      },
      propertySize:{
        type:DataTypes.STRING,
        allowNull:true
    },
      price:{
          type:DataTypes.NUMBER,
          allowNull:true
      },
      rating:{
          type:DataTypes.NUMBER,
          allowNull:true
      },

      agentId:{
      type:DataTypes.UUIDV4,
      allowNull:true
  },
    
},

{
    sequelize:db,
    tableName:'house'
});
