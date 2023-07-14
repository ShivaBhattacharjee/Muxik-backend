import nodemailer from "nodemailer";

// Function to create and return a nodemailer transporter
export function createTransporter() {
  console.log("Emailid" + process.env.EMAIL_ID)
  console.log("EmailPassword" + process.env.EMAIL_PASSWORD)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}
