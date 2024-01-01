import nodemailer from "nodemailer";

// Function to create and return a nodemailer transporter
export function createTransporter() {
  return nodemailer.createTransport({
    service : process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}
