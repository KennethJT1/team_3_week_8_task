import express,{Request, Response} from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from './routes/Users';
import indexRouter from './routes/index';
import adminRouter from './routes/Admin';
import agentRouter from './routes/Agent';
import {db} from './config/index';
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';

const app = express()

//environment configuration
dotenv.config()


// Sequelize database connection
db.sync().then(()=>{
    console.log("Db connected successfuly")
}).catch(err=>{
    console.log(err)
})


//middlewares
app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser())

//setting up public folder
app.use(express.static(path.join(process.cwd(), "public")));


// //view engine setup for ejs
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");


//Router middleware
app.use('/',  indexRouter)
app.use('/users', userRouter)
app.use('/admins', adminRouter)
app.use('/agents', agentRouter)

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})