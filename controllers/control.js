
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import jwt  from "jsonwebtoken";
dotenv.config({path:'../.env'})

// post method register route
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;
        
        // Check if the username or email already exists in the database
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).send({
                    message: "An account with this email already exists"
                });
            } else if (existingUser.username === username) {
                return res.status(400).send({
                    message: "Username is already taken"
                });
            }
        }
        
        
        // If the username and email are unique, proceed with user registration
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            profile: profile || "",
            email
        });
        
        const savedUser = await newUser.save();
        
        res.status(201).send({
            message: "User registration successful",
            user: savedUser
        });
    } catch (error) {
        return res.status(500).send({
            message: "Error in register route",
            error: error.message
        });
    }
}

// post method login route
export async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({
                message: "Username didnot match"
            });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({
                message: "Password did not match"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "48h" }
        );

        res.status(200).send({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        return res.status(500).send({
            message: "Something went wrong while login ",
            error: error.message
        });
    }
}


// get request to get user data after login
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username) {
            return res.status(400).send({
                message: "Invalid username"
            });
        }

        const user = await User.findOne({ username }).select("-password").exec();

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }
        
        return res.status(200).send(user);
          
    } catch (error) {
        return res.status(500).send({
            message: "Unable to get user",
            error: error.message
        });
    }
}


// put request to update user
export async function updateUser(req, res) {
    res.json("Update user route")
}

// get method to generate otp for verification
export async function generateOTP(req, res) {
    res.json("Otp Generation Route")
}

// get method to verify otp

export async function verifyOTP(req, res) {
    res.json("Verify Otp")
}

// get request to create a reset session

export async function resetSession(req, res) {
    res.json("this is reset session")
}



// get request for reset session

export async function passwordReset(req, res) {
    res.json("Remember your password dumb ass")
}

