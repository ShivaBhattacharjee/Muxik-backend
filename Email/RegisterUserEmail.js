import nodemailer from "nodemailer"
import Mailgen  from "mailgen"  
import dotenv from "dotenv"
dotenv.config

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'justina.jenkins22@ethereal.email',
      pass: 'sA7mWYtFuPMTV43hyu'
  }
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
      name: 'Mailgen',
      link: 'https://mailgen.js/'
  }
});

export default RegisterMailer = async(req,res)=>{
  const {username, userEmail , text, subject} = req.body
}