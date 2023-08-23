// importing packages
import express  from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import cors from "cors"
import connect from "../config/Database.js";
import router from "./routes/route.js"
// configuring .env
dotenv.config()


// express port setup
const app = express()

// middlewares
app.use(express.json())
app.use(cors({
    "origin": "*",
    "methods": "GET,PUT,POST,DELETE",
}))
app.use(morgan('tiny'))
app.disable('x-powered-by')

// cors related functions

connect().then(()=>{
    try{
        app.listen(process.env.PORT,()=>{
            console.log("📑 Visit the docs at https://github.com/ShivaBhattacharjee/Muxik-backend/blob/main/README.MD")
            console.log("🎶 Visit Muxik https://muxik.netlify.app/")
            console.log("🗄️ Server started at http://localhost:" + process.env.PORT)
        })
    }catch(error){
        console.log("⚠️ Cannot connect to server" + error)
    }
}).catch(error=>{
    console.log("⚠️ Connection failed " + error)
})

// home page route

app.get("/",(req,res)=>{
    if(req)res.status(201).send("👋 welcome to Muxik backend  \n Visit Muxik at: <a href='https://muxik.netlify.app' target='_blank'>https://muxik.netlify.app</a>")
})

// app routes

app.use('/api',router)