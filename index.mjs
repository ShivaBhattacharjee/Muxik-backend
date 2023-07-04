// importing packages
import express  from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import cors from "cors"
import connect from "./config/Database.js";
import router from "./routes/route.js"
// configuring .env
dotenv.config({path:'./.env'})


// express port setup
const app = express()

// middlewares
app.use(express.json())
app.use(cors({
    origin:"*"
}))
app.use(morgan('tiny'))
app.disable('x-powered-by')

// cors related functions

connect().then(()=>{
    try{
        app.listen(process.env.PORT,()=>{
            console.log("server started at http://localhost:" + process.env.PORT)
        })
    }catch(error){
        console.log("Cannot connect to the server")
    }
}).catch(error=>{
    console.log("cannot connect to the database" + error)
})

// home page route

app.get("/",(req,res)=>{
    res.status(201).send("Hello welcome to Muxik backend 👋 \n Visit Docs : https://xyz.com/docs ")
})

// app routes

app.use('/api',router)