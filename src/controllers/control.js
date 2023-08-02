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
async function sendResetPasswordEmail(email, otp) {
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

// Function to generate and save OTP for password reset
async function generateAndSaveOTP(email) {
  try {
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Save the OTP and expiration time in the user document
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    user.resetPasswordOTP = OTP;
    user.resetPasswordExpiration = expirationTime;
    await user.save();

    console.log("Saved OTP and expiration time:", user);

    return OTP;
  } catch (error) {
    console.error('Error while generating and saving OTP:', error);
    throw new Error('Failed to generate and save OTP');
  }
}


// POST method for initiating password reset
export async function initiatePasswordReset(req, res) {
  const { email } = req.body;
  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: 'Email not found',
      });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).send({
        message: 'Password reset not allowed for non-verified users',
      });
    }
    // Generate and save OTP for password reset
    const OTP = await generateAndSaveOTP(email);

    // Send password reset email
    const emailStatus = await sendResetPasswordEmail(email, OTP);

    res.status(200).send({
      message: 'Password reset initiated',
      email,
      OTP,
      otpStatus: emailStatus ? `Password reset email sent to ${email}` : 'Failed to send password reset email',
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Error in initiating password reset',
      error: error.message,
    });
  }
}




// POST method for verifying OTP and updating password
export async function verifyPasswordReset(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "Email not found",
      });
    }
    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).send({
        message: 'Password reset not allowed for non-verified users',
      });
    }

    console.log("user.resetPasswordOTP:", user.resetPasswordOTP);
    console.log("otp.toString():", otp.toString());
    console.log("Date.now():", Date.now());
    console.log("user.resetPasswordExpiration:", user.resetPasswordExpiration);

    // Verify if the provided OTP matches the stored OTP and check for expiration
    if (user.resetPasswordOTP !== otp.toString() || Date.now() > user.resetPasswordExpiration) {
      return res.status(400).send({
        message: "Invalid OTP or OTP expired",
      });
    }

    // Reset the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear the reset password fields
    user.resetPasswordOTP = null;
    user.resetPasswordExpiration = null;
    await user.save();

    res.status(200).send({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error in password reset",
      error: error.message,
    });
  }
}



// Function to send the reset session status
// export async function resetSession(req, res) {
//   if (req.app.locals.resetSession) {
//     return res.status(201).send({ flag: req.app.locals.resetSession });
//   }
//   return res.status(440).send({ error: "Session expired!" });
// }


















