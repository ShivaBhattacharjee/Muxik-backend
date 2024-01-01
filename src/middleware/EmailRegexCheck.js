const ValidateEmailRegex = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userEmail = req.body.email;

  if (userEmail.length > 1000) {
    return res.status(400).json({ error: "too long" });
  }

  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};

export default ValidateEmailRegex;
