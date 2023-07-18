import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { createTransporter } from "../../utils/EmailConfig.js";
// Function to send OTP by email
async function sendOTPByEmail(email, otp) {
  try {
    const transporter = createTransporter();

    // Configure the email options
    const mailOptions = {
      from: "muxikverification@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Dear ${email}, welcome to Muxik, a platform for audiophiles to enjoy music without a paywall. Sign up on our platform using this password. If you didn't try to register on our platform, ignore this message.\nYour OTP: ${otp}`,
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

    // Configure the email options
    const mailOptions = {
      from: 'muxikverification@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `Dear ${email}, you have requested to reset your password. Please use the following OTP to reset your password: ${otp}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
    return info.messageId; // Return the message ID as a status of successful email sending
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
      return res.status(400).send({
        message: 'User is not verified. Please verify your account first.',
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
  const { verificationCode } = req.body;
  const { email } = req.query;

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
        message: "Username does not match",
      });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).send({
        message: "User is not verified. Please verify your account.",
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
    const id = req.query.id;
    if (id) {
      const body = req.body;

      const result = await User.updateOne({ _id: id }, body);

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

// get liked songs
export async function getLikedSongs(req, res) {
  const { username } = req.params;
  const { page = 1 } = req.query; // Default page number is 1
  const limit = 12; // Number of songs per page

  try {
    if (!username) {
      return res.status(400).send({
        message: "Invalid username",
      });
    }

    const user = await User.findOne({ username }).select("likedSongs").exec();

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Calculate the starting index for the songs based on the page number and limit
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get the songs for the current page
    const songs = user.likedSongs.slice(startIndex, endIndex);

    // Create an object to hold the paginated results
    const paginatedResult = {
      songs,
      nextPage: user.likedSongs.length > endIndex ? true: false,
    };

    return res.status(200).send(paginatedResult);
  } catch (error) {
    return res.status(500).send({
      message: "Unable to fetch liked songs",
      error: error.message,
    });
  }
}

// POST method to add a liked song for a user
export async function addLikedSong(req, res) {
  const { username, songId, songName, banner } = req.body;
  try {
    if (!username || !songId || !songName || !banner) {
      return res.status(400).send({
        message: "Invalid request body. Please provide all required fields.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Check if the song already exists in the liked songs list
    const existingSong = user.likedSongs.find(
      (song) => song.songId === songId
    );
    if (existingSong) {
      return res.status(400).send({
        message: "Song already exists in the liked songs list",
      });
    }

    // Add the new song to the liked songs list
    user.likedSongs.push({ songId, songName, banner });
    await user.save();

    return res.status(200).send({
      message: "Song added to the liked songs list",
      song: { songId, songName, banner },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error in adding liked song",
      error: error.message,
    });
  }
}

// DELETE method to remove a liked song for a user
export async function removeLikedSong(req, res) {
  const { username, songId } = req.params;
  try {
    if (!username || !songId) {
      return res.status(400).send({
        message: "Invalid request parameters. Please provide username and songId.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Find the index of the song in the liked songs list
    const songIndex = user.likedSongs.findIndex(
      (song) => song.songId === songId
    );
    if (songIndex === -1) {
      return res.status(404).send({
        message: "Song not found in the liked songs list",
      });
    }

    // Remove the song from the liked songs list
    user.likedSongs.splice(songIndex, 1);
    await user.save();

    return res.status(200).send({
      message: "Song removed from the liked songs list",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error in removing liked song",
      error: error.message,
    });
  }
}
