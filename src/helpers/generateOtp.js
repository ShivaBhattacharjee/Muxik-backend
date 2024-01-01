import otpGenerator from "otp-generator";

export const OTPGenerator = otpGenerator.generate(8, {
  lowerCaseAlphabets: true,
  upperCaseAlphabets: true,
  specialChars: false,
});
