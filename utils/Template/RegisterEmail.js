// Define your email template as a template literal
const emailTemplate = `
  <html>
    <body>
      <h3>Welcome to Muxik - Your OTP for Sign Up</h3>
      <p>Dear \${email},</p>
      <p>We are thrilled to welcome you to Muxik, the ultimate platform for audiophiles like you to enjoy music without any paywall hindrance. Your journey into a world of seamless music exploration starts now!</p>
      <p>To complete your sign-up process, please use the One-Time Password (OTP) provided below. This unique code ensures the security of your account and confirms your genuine interest in joining our community of passionate music lovers.</p>
      <h1>Your OTP: \${otp}</h1>
    </body>
  </html>
`;

export default emailTemplate;
