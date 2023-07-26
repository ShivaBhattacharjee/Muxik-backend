const validateEmail = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ message : 'Invalid email format' });
    }
    next();
  };
  
export default validateEmail