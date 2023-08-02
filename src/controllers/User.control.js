import User from "../models/user.model.js";
import { sendOTPByEmail } from "./Otp.control.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
// post method to register user
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "An account with this email already exists",
      });
    }

    // If the email doesn't exist, proceed with normal registration
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
    const otpStatus = await sendOTPByEmail(email, OTP);

    res.status(201).send({
      message: "User registration successful",
      user: savedUser,
      verificationMail: email,
      otpExpire: expirationTime,
      otpStatus: otpStatus ? `OTP sent to ${email}` : "Failed to send OTP",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error in register route",
      error: error.message,
    });
  }
}

// verifing registration
export async function verifyRegister(req, res) {
  const { email, verificationCode } = req.query;

  try {
    const user = await User.findOne({ email, verificationCode });

    if (!user) {
      return res.status(400).send({
        message: "Invalid verification code",
      });
    } else if (Date.now() > user.otpExpire) {
      // Check if OTP has expired
      await User.deleteOne({ _id: user._id }); // Delete the user account
      return res.status(400).send({
        message: "OTP expired. User account deleted.",
      });
    }

    // Update the user's isVerified field to true
    user.isVerified = true;
    user.verificationCode = ""; // Clear the verification code
    await user.save();

    return res.status(200).send({
      message: "Account verification successful",
      isVerified: true, // Add the isVerified property to the response
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error in account verification",
      error: error.message,
    });
  }
}


// POST method for resending verification email
export async function resendVerificationEmail(req, res) {
  const { email } = req.query;
  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: 'Email not found',
      });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).send({
        message: 'User is already verified',
      });
    }

    // Generate and save a new verification code
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    user.verificationCode = OTP;
    user.otpExpire = expirationTime;
    await user.save();

    // Send the new verification code via email
    const emailStatus = await sendOTPByEmail(email, OTP);

    res.status(200).send({
      message: 'Verification email resent',
      email,
      otpExpire: expirationTime,
      otpStatus: emailStatus ? `OTP sent to ${email}` : 'Failed to send OTP',
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Error in resending verification email',
      error: error.message,
    });
  }
}


// post method to login user
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({
        message: "Username does not match",
      });
    }


    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({
        message: "Password does not match",
      });
    }



    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.status(200).send({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong while logging in",
      error: error.message,
    });
  }
}

// get request to get user data after login
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) {
      return res.status(400).send({
        message: "Invalid username",
      });
    }

    const user = await User.findOne({ username }).select("-password").exec();

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({
      message: "Unable to get user",
      error: error.message,
    });
  }
}

// put request to update user
export async function updateUser(req, res) {
  try {
    const username = req.query.username; 
    if (username) {
      const body = req.body;

      const result = await User.updateOne({ username: username }, body);

      if (result.modifiedCount === 0) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      return res.status(200).send({
        message: "Records updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error in update user route. Contact the developer for help.",
      error: error.message,
    });
  }
}



  