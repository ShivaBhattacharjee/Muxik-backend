import User from "../models/user.model.js";
import sendEmail from "../helpers/sendEmail.js";
import jwt from "jsonwebtoken";
import { comparePassword } from "../helpers/comparePasswordHash.js";
import { HashPassword } from "../helpers/hashPassword.js";
import { OTPGenerator } from "../helpers/generateOtp.js";
import { HTTP_STATUS, errorMessage } from "../enums/enums.js";

export async function Register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    if (!(username && password && profile && email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }
    const existingUser = await User.findOne({ email: { $eq: email } });

    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.USER_ALREADY_EXIST,
      });
    }

    const hashedPassword = await HashPassword(password);
    const OTP = OTPGenerator;

    const newUser = new User({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
      verificationCode: OTP,
    });

    const saveUser = await newUser.save();
    if (saveUser) {
      sendEmail(email, OTP, "REGISTER");
    }
    res.status(HTTP_STATUS.OK).send({
      message: "User registration successful",
      otpStatus: saveUser ? `OTP sent to ${email}` : "Failed to send OTP",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error registering user",
    });
  }
}

export async function VerifyRegister(req, res) {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email: { $eq: email } });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    if (user.verificationCode != verificationCode) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.INCORRECT_OTP,
      });
    }
    user.isVerified = true;
    user.verificationCode = "";
    await user.save();
    return res.status(HTTP_STATUS.OK).send({
      message: "Account verification successful",
    });
  } catch (error) {
    EmailServer.js;
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error in account verification",
    });
  }
}

export async function ResendVerificationEmail(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: { $eq: email } });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }
    if (user.isVerified) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: "User is already verified",
      });
    }
    const OTP = OTPGenerator;
    user.verificationCode = OTP;

    await user.save();
    const emailStatus = await sendEmail(email, OTP, "REGISTER");

    res.status(HTTP_STATUS.OK).send({
      message: "Verification email resent successfully",
      otpStatus: emailStatus ? `OTP sent to ${email}` : "Failed to send OTP",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error in resending verification email",
    });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send({ error: errorMessage.REQUIRED_FIELDS });
    }
    const user = await User.findOne({ email: { $eq: email } });
    if (!(email && password)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }
    const passwordCheck = await comparePassword(password, user.password);

    if (!passwordCheck) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        message: "Password does not match",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.status(HTTP_STATUS.OK).send({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: "Something went wrong while logging in",
      error: error.message,
    });
  }
}

// get request to get user data after login
export async function getUser(req, res) {
  const username = req.user.username;
  try {
    if (!username) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }

    const user = await User.findOne({ username }).select("-password").exec();

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    return res.status(HTTP_STATUS.OK).send(user);
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}

export async function UpdateUser(req, res) {
  try {
    const username = req.user.username;
    const { newUsername, profile } = req.body;
    const user = User.findOne({ username: { $eq: username } });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }
    if (profile) {
      user.profile = profile;
    }
    if (newUsername) {
      user.username = newUsername;
    }
    await user.save();
    return res.status(HTTP_STATUS.OK).send({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error:
        error.message ||
        "Error in update user route. Contact the developer for help.",
    });
  }
}
