import express, { Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import {db}  from './config/database';

const app = express();

//dotenv
dotenv.config();

//Database connection
db.sync().then(() => console.log('Database connected...')).catch(err=> console.log(err))



const port = process.env.PORT
app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}`))