import nodemailer from "nodemailer";

// Function to create and return a nodemailer transporter for development
// get host port and other info from https://ethereal.email/create
// this is test data
export default function Transporter() {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "heber.schuster52@ethereal.email",
      pass: "qdyy2VD2QjNRN24sMu",
    },
  });
}

// for production

// export default function Transporter() {
//   return nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.env.EMAIL_ID,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
// }
