import express,{Request, Response} from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser'
import userRouter from './routes/Users'
import indexRouter from './routes/index'
import adminRouter from './routes/Admin'
import agentRouter from './routes/Agent'
import {db} from './config/index'

// Sequelize connection
db.sync().then(()=>{
    console.log("Db connected successfuly")
}).catch(err=>{
    console.log(err)
})

const app = express()



app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser())

//Router middleware
app.use('/',  indexRouter)
app.use('/users', userRouter)
app.use('/admins', adminRouter)
app.use('/agents', agentRouter)

const port = 4040
app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})

export default app