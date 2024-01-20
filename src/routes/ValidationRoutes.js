import { Router } from "express";
import { Login, Register, ResendVerificationEmail, VerifyRegister } from "../controllers/User.control.js";
import ValidateEmailRegex from "../middleware/EmailRegexCheck.js";
import { isVerified } from "../middleware/VerifiedUser.js";
import { ConfirmResetPassword, InitiateResetPassword } from "../controllers/ResetPassword.control.js";
import healthCheck from "../controllers/HealthCheck.control.js";
const Validationrouter = Router();

Validationrouter.route("/").all(healthCheck);
// validation routes
Validationrouter.route("/register").post(ValidateEmailRegex, Register);
Validationrouter.route("/verify-registration").post(ValidateEmailRegex, VerifyRegister);
Validationrouter.route("/resent-verification-otp").post(ValidateEmailRegex, ResendVerificationEmail);
Validationrouter.route("/reset-password").post(ValidateEmailRegex, InitiateResetPassword);
Validationrouter.route("/confirm-reset-password").post(ValidateEmailRegex, ConfirmResetPassword);
Validationrouter.route("/login").post(ValidateEmailRegex, isVerified, Login);

export default Validationrouter;
