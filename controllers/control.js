import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
// post method register route
export async function register(req, res) {
    try {
        const [username, password, profile, email] = req.body

        // checking if user or email already exists

        const existUserName = new Promise((resolve, reject) => [
            userModel.findOne({ username }, function (err, user) {
                if (err) reject(new Error(err))
                if (user) reject({ error: "Username already exists" })

                resolve();
            })
        ])


        const existEmail = new Promise((resolve, reject) => [
            userModel.findOne({ email }, function (err, email) {
                if (err) reject(new Error(err))
                if (email) reject({ error: "An account is already associated witht this email" })

                resolve();
            })
        ]);

        Promise.all([existUserName, existEmail]).then(() => {
            if (password) {
                bcrypt.hash(password, 10).then(hashedPassword => {
                    const user = new userModel({
                        username,
                        password: hashedPassword,
                        profile: profile || "",
                        email
                    }).catch(error => {
                        return res.status(500).send({
                            error: "unable to hash password"
                        })
                    })

                    user.save().then(result => res.status(201).send({
                        message: "User Registration successful"
                    })).catch(error => {
                        res.status(500).send({
                            message: "Unable to register user"
                        })
                    })
                })
            }
        }).catch(error => {
            return res.status(500).send({
                message : "Error unable to save data"
            })
        })
    } catch (error) {
        return res.status(500).send({
            message : "Error in register route"
        })
    }
}

// post method login route
export async function login(req, res) {
    res.json('Login Route')
}

// get request to get user data after login
export async function getUser(req, res) {
    res.json('User Route')
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

