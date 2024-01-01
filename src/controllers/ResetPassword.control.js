import User from "../models/user.model.js";
import { OTPGenerator } from "../helpers/generateOtp.js";
import SendEmail from "../helpers/sendEmail.js";
import { HTTP_STATUS, errorMessage } from "../enums/enums.js";
import { HashPassword } from "../helpers/hashPassword.js";

export async function InitiateResetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = User.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }
    const OTP = OTPGenerator;
    User.isResetPasswordInitiated = true;
    User.resetPasswordOTP = OTP;
    const saveUser = await User.save();
    if (saveUser) {
      await SendEmail(email, OTP, "RESET_PASSWORD");
    }
    res.status(HTTP_STATUS.OK).send({
      message: "Reset password initiated",
      otpStatus: saveUser ? `OTP sent to ${email}` : "Failed to send OTP",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error initiating reset password",
    });
  }
}

export async function ConfirmResetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!(email && otp && newPassword)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }
    if (!User.isResetPasswordInitiated) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: "Password reset not initiated",
      });
    }
    if (User.resetPasswordOTP != otp) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: "Invalid OTP",
      });
    }
    const newHashPassword = HashPassword(newPassword);
    User.password = newHashPassword;
    User.isResetPasswordInitiated = false;
    User.resetPasswordOTP = null;
    return res.status(HTTP_STATUS.OK).send({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error confirming reset password",
    });
  }
}
