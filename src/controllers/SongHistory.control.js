import { HTTP_STATUS, errorMessage } from "../enums/enums.js";
import User from "../models/user.model.js";

export async function getSongHistory(req, res) {
  const { username } = req.params;
  const { page = 1 } = req.query; // Default page number is 1
  const limit = 12; // Number of songs per page

  try {
    if (!username) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: "Invalid request parameters. Please provide username.",
      });
    }
    const user = await User.findOne({ username }).select("songHistory").exec();
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const songs = user.songHistory.slice(startIndex, endIndex);

    const paginatedResult = {
      songs,
      nextPage: user.songHistory.length > endIndex ? true : false,
    };
    return res.status(HTTP_STATUS.OK).send(paginatedResult);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Unable to fetch history",
    });
  }
}

export async function addSongToHistory(req, res) {
  const { username, songId, songName, banner } = req.body;
  try {
    if (!username || !songId || !songName || !banner) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    const existingSongIndex = user.songHistory.findIndex(
      (song) => song.songId === songId
    );

    if (existingSongIndex !== -1) {
      user.songHistory.splice(existingSongIndex, 1);
    }

    user.songHistory.unshift({ songId, songName, banner });

    const maxSongHistoryLength = 50;
    if (user.songHistory.length > maxSongHistoryLength) {
      user.songHistory = user.songHistory.slice(0, maxSongHistoryLength);
    }

    await user.save();

    return res.status(HTTP_STATUS.OK).send({
      message: "Song added to the song history",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error in adding song to the song history",
    });
  }
}

export async function removeSongFromHistory(req, res) {
  const { username, songId } = req.params;
  try {
    if (!username || !songId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        error: errorMessage.REQUIRED_FIELDS,
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST,
      });
    }

    const songIndex = user.songHistory.findIndex(
      (song) => song.songId === songId
    );
    if (songIndex === -1) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        message: "Song not found in the song history",
      });
    }

    user.songHistory.splice(songIndex, 1);
    await user.save();

    return res.status(HTTP_STATUS.OK).send({
      message: "Song removed from the song history",
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || "Error in removing song from the song history",
    });
  }
}
