import User from "../models/user.model.js";

// get request to get user data after login
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) {
      return res.status(400).send({
        message: "Invalid username",
      });
    }

    const user = await User.findOne({ username }).select("-password").exec();

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({
      message: "Unable to get user",
      error: error.message,
    });
  }
}

// put request to update user
export async function updateUser(req, res) {
  try {
    const username = req.query.username; 
    if (username) {
      const body = req.body;

      const result = await User.updateOne({ username: username }, body);

      if (result.modifiedCount === 0) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      return res.status(200).send({
        message: "Records updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error in update user route. Contact the developer for help.",
      error: error.message,
    });
  }
}

  