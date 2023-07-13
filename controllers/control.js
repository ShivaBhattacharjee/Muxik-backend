import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// Function to send OTP by email
async function sendOTPByEmail(email, otp) {
    try {
      // Create a nodemailer transporter with your email provider settings
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'destinee81@ethereal.email',
          pass: 'uwtj1F3tQSvphygWJg'
        }
      });
  
      // Configure the email options
      const mailOptions = {
        from: "muxikverification@gmail.com",
        to: email,
        subject: "OTP Verification",
        text: `Dear ${email} welcome to Muxik a platform for audiophiles to enjoy music without a paywall \n Your OTP: ${otp}`,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("OTP sent successfully");
      return info.messageId; // Return the message ID as a status of successful OTP sending
    } catch (error) {
      console.error("Error while sending OTP:", error);
      throw new Error("Failed to send OTP");
    }
  }
  
  // post method register route
  export async function register(req, res) {
    try {
      const { username, password, profile, email } = req.body;
  
      // Check if the username or email already exists in the database
  
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).send({
            message: "An account with this email already exists",
          });
        } else if (existingUser.username === username) {
          return res.status(400).send({
            message: "Username is already taken",
          });
        }
      }
  
      // If the username and email are unique, proceed with user registration
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const OTP = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
      const newUser = new User({
        username,
        password: hashedPassword,
        profile: profile || "",
        email,
        isVerified: false,
        verificationCode: OTP,
      });
      const savedUser = await newUser.save();
  
      // Send OTP to the user's email
      const messageId = await sendOTPByEmail(email, OTP); // Call the function to send OTP by email
  
      res.status(201).send({
        message: "User registration successful",
        user: savedUser,
        verificationMail: email,
        otpExpire: expirationTime,
        otpStatus: messageId ? `OTP sent to ${email}` : "Failed to send OTP",
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error in register route",
        error: error.message,
      });
    }
  }
  export async function verifyRegister(req, res) {
    const { verificationCode } = req.body;
    const { email } = req.query;
  
    try {
      const user = await User.findOne({ email, verificationCode });
  
      if (!user) {
        return res.status(400).send({
          message: "Invalid verification code",
        });
      }else if(Date.now()>user.expirationTime){
        return res.status(400).send({
          message: "OTP Expired",
        });
      }

      // Update the user's isVerified field to true
      user.isVerified = true;
      user.verificationCode = ""; // Clear the verification code
      await user.save();
  
      return res.status(200).send({
        message: "Account verification successful",
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error in account verification",
        error: error.message,
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
    try {
        const id = req.query.id;
        if (id) {
            const body = req.body;
            
            const result = await User.updateOne({ _id: id }, body);
            
            if (result.nModified === 0) {
                return res.status(404).send({
                    message: "User not found"
                });
            }
            
            return res.status(200).send({
                message: "Records updated"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error in update user route. Contact the developer for help.",
            error: error.message
        });
    }
}




// get request to create a reset session

export async function resetSession(req, res) {
    if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}



// get request for reset session

export async function passwordReset(req, res) {
  try {
    if(!req.app.locals.resetSession) return res.status(404).send({
        error : "Session expired"
    })
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "Username not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(400).send({ message: "New password and old password cannot be the same" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne({ username: user.username }, { password: hashedPassword });

    req.app.locals.resetSession = false; // reset session
    return res.status(201).send({ msg: "Record updated" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}



