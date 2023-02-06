import express from "express";
import cors from 'cors'
import morgan from "morgan";
import connect from "./database/connection.js";
import router from "./router/route.js";


const app=express()

/** middlewares */
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by') // less hackers know about the stack


const port = 8080

/** HTTP GET Request */
app.get('/',(req,res)=>{
    res.status(201).json('Home GET Request')
})


/** api routes */
app.use('/api',router)


/** Start server only when there is a valid connection to mongo */
connect().then(()=>{
    try {
        app.listen(port, ()=>{
            console.log('server started on port : '+port)
        })
    } catch (error) {
        console.log("cannot connect to database")
    }
}).catch(error=>{
    console.log("invalid database connection...!")
})










