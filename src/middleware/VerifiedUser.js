// isVerifiedMiddleware.js
import { HTTP_STATUS, errorMessage } from "../enums/enums.js";
import User from "../models/user.model.js";

export async function isVerified(req, res, next) {
  try {
    const username = req.body.email;

    if (!username) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    const user = await User.findOne({ email: { $eq: username } });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.NOT_FOUND,
      });
    }

    if (!user.isVerified) {
      return res.status(HTTP_STATUS.NOT_AUTHORIZED).send({
        error: errorMessage.USER_NOT_VERIFIED,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error:
        error.message ||
        "Error in isVerified middleware. Contact the developer for help.",
    });
  }
}
