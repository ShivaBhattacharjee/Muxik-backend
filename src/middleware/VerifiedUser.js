// isVerifiedMiddleware.js
import User from '../models/user.model.js';

export async function isVerified(req, res, next) {
  try {
    let username = req.body.username;
    const { usernameQuery } = req.query;

    // If username is not in the body, check for usernameQuery in the query parameters
    if (!username) {
      username = usernameQuery;
    }

    // If there's still no username, extract it from the request parameters
    if (!username) {
      username = req.params.username;
    }

    // Check if a valid username is provided
    if (!username) {
      return res.status(400).send({
        message: "Invalid username",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).send({
        message: "User is not verified",
      });
    }

    // If the user is verified, you can proceed to the next middleware or the route handler
    req.user = user; // Attach the user object to the request for further usage in other middleware/route handlers
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error in isVerified middleware. Contact the developer for help.",
      error: error.message,
    });
  }
}
