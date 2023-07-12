import mongoose, { mongo } from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username already exists, choose another"]
    },
    password: {
        type: String,
        required: [true, "Please Provide a password"],
        unique: false
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: [true, "An account is already assosiated with this email id"],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    profile: {
        type: String
    },
})

export default mongoose.model.Users || mongoose.model('User', UserSchema)