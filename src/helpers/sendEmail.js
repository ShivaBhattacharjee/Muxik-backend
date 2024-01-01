import Transporter from "../../config/EmailServer.js";
import emailTemplate from "../utils/Template/RegisterEmail.js";
import passwordResetTemplate from "../utils/Template/ForgotPassword.js";

export default async function SendEmail(email, OTP, emailType) {
  const formattedRegisterTemplate = emailTemplate
    .replace(/\${email}/g, email)
    .replace(/\${otp}/g, OTP);

  const formattedPasswordReset = passwordResetTemplate
    .replace(/\${email}/g, email)
    .replace(/\${otp}/g, OTP);

  try {
    emailType.toUpperCase();
    const transporter = Transporter();

    const mailOptions = {
      from: process.env.EMAIL_ID || "",
      to: email,
      subject: `${
        emailType === "REGISTER"
          ? "Welcome to Muxik - Your OTP for Sign Up"
          : "Password Reset Request for Your Muxik Account"
      }`,

      html:
        emailType === "REGISTER"
          ? formattedRegisterTemplate
          : formattedPasswordReset,
    };

    await transporter.sendMail(mailOptions);
    return "Email sent successfully";
  } catch (error) {
    throw new Error(error.message);
  }
}
