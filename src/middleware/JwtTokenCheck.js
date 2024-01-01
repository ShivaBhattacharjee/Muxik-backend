import decryptJwt from "../helpers/decryptJwt.js";

const jwtTokenCheck = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = decryptJwt(token);
    const username = decodedToken.username;

    if (!username) {
      return res
        .status(401)
        .json({ message: "Invalid token format: Missing username" });
    }

    req.user = { username };
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export default jwtTokenCheck;
