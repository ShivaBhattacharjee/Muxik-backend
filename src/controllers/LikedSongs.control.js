import { HTTP_STATUS, errorMessage } from "../enums/enums.js";
import User from "../models/user.model.js";
export async function getLikedSongs(req, res) {
  const username = req.user.username;
  const { page = 1 } = req.query; // Default page number is 1
  const limit = 12; // Number of songs per page

  try {
    if (!username) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }

    const user = await User.findOne({ username: { $eq: username } })
      .select("likedSongs")
      .exec();

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const songs = user.likedSongs.slice(startIndex, endIndex);

    const paginatedResult = {
      songs,
      nextPage: user.likedSongs.length > endIndex ? true : false,
    };

    return res.status(HTTP_STATUS.OK).send(paginatedResult);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Unable to fetch liked songs",
    });
  }
}

// POST method to add a liked song for a user
export async function addLikedSong(req, res) {
  const username = req.user.username;
  const { songId, songName, banner } = req.body;
  try {
    if (!username || !songId || !songName || !banner) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }

    const user = await User.findOne({ username: { $eq: username } });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    const existingSong = user.likedSongs.find((song) => song.songId === songId);
    if (existingSong) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: "Song already exists in the liked songs list",
      });
    }

    user.likedSongs.push({ songId, songName, banner });
    await user.save();

    return res.status(HTTP_STATUS.OK).send({
      message: "Song added to the liked songs list",
      song: { songId, songName, banner },
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error in adding liked song",
    });
  }
}

// DELETE method to remove a liked song for a user
export async function removeLikedSong(req, res) {
  const username = req.user.username;
  const { songId } = req.params;
  try {
    if (!username || !songId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }

    const user = await User.findOne({ username: { $eq: username } });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    const songIndex = user.likedSongs.findIndex(
      (song) => song.songId === songId
    );
    if (songIndex === -1) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: "Song not found in the liked songs list",
      });
    }
    user.likedSongs.splice(songIndex, 1);
    await user.save();

    return res.status(HTTP_STATUS.OK).send({
      message: "Song removed from the liked songs list",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error in removing liked song",
    });
  }
}
