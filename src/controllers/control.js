import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { createTransporter } from "../../utils/EmailConfig.js";
import emailTemplate from "../../utils/Template/RegisterEmail.js";
import passwordResetTemplate from "../../utils/Template/ForgotPassword.js";
// Function to send OTP by email
 export async function sendOTPByEmail(email, otp) {
  try {
    const transporter = createTransporter();

    const formattedTemplate = emailTemplate
      .replace(/\${email}/g, email)
      .replace(/\${otp}/g, otp);
    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Welcome to Muxik - Your OTP for Sign Up",
      html: formattedTemplate
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

// Function to send the reset password email
export async function sendResetPasswordEmail(email, otp) {
  try {
    // Create a nodemailer transporter with your email provider settings
    const transporter = createTransporter();
    const formattedPasswordReset = passwordResetTemplate
      .replace(/\${email}/g, email)
      .replace(/\${otp}/g, otp);
    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'Password Reset Request for Your Muxik Account',
      html: formattedPasswordReset
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
    return info.messageId; 
  } catch (error) {
    console.error('Error while sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}







// Function to send the reset session status
// export async function resetSession(req, res) {
//   if (req.app.locals.resetSession) {
//     return res.status(201).send({ flag: req.app.locals.resetSession });
//   }
//   return res.status(440).send({ error: "Session expired!" });
// }


















