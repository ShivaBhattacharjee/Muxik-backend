import jwt from "jsonwebtoken";

function decryptJwt(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return {
      userId: decoded._id,
      username: decoded.username,
      email: decoded.email,
      isVerified: decoded.isVerified,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export default decryptJwt;
