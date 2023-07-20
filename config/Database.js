// mongo db connection
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
async function connect(){
    const mongodb = await  MongoMemoryServer.create()
    const getUri = mongodb.getUri(process.env.MONGO_DB_URI)

    mongoose.set('strictQuery', true)
    const db = await mongoose.connect(getUri)
    if(db){
        console.log("🥳 Databse created successfully")
    }else{
        console.log("😕 Unable to create database")
    }
    return db
}
export default connect