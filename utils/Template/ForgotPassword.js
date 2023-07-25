const passwordResetTemplate = `
  <html>
    <body>
      <h3>Password Reset Request</h3>
      <p>Dear \${email},</p>
      <p>We received a request to reset your password for your account at Muxik. If you didn't initiate this request, you can safely ignore this email.</p>
      <p>To proceed with the password reset, please use the following One-Time Password (OTP) within the next 15 minutes:</p>
      <h1><b>Reset Password Otp: \${otp} </b></h1>
      <p>Best regards,</p>
      <p>The Muxik Team</p>
    </body>
  </html>
`;

export default passwordResetTemplate;
