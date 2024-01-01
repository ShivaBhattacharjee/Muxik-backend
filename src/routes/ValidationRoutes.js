import { Router } from "express";
import {
  Login,
  Register,
  ResendVerificationEmail,
  VerifyRegister,
} from "../controllers/User.control.js";
import ValidateEmailRegex from "../middleware/EmailRegexCheck.js";
import { isVerified } from "../middleware/VerifiedUser.js";
const Validationrouter = Router();

// validation routes
Validationrouter.route("/register").post(ValidateEmailRegex, Register);
Validationrouter.route("/verify-registration").post(
  ValidateEmailRegex,
  VerifyRegister
);
Validationrouter.route("/resent-verification-otp").post(
  ValidateEmailRegex,
  ResendVerificationEmail
);
Validationrouter.route("/reset-password").post(ValidateEmailRegex);
Validationrouter.route("/login").post(ValidateEmailRegex, isVerified, Login);

export default Validationrouter;
