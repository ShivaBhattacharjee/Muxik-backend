import User from "../models/user.model.js";
// GET method to get the song history for a user
export async function getSongHistory(req, res) {
    const { username } = req.params;
    const { page = 1 } = req.query; // Default page number is 1
    const limit = 12; // Number of songs per page
  
    try {
      if (!username) {
        return res.status(400).send({
          message: "Invalid username",
        });
      }
  
      const user = await User.findOne({ username }).select("songHistory isVerified").exec();
  
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }
  
      // Check if the user is verified
      if (!user.isVerified) {
        return res.status(400).send({
          message: "User is not verified. Please verify your account first.",
        });
      }
  
      // Calculate the starting index for the songs based on the page number and limit
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      // Get the songs for the current page
      const songs = user.songHistory.slice(startIndex, endIndex);
  
      // Create an object to hold the paginated results
      const paginatedResult = {
        songs,
        nextPage: user.songHistory.length > endIndex ? true : false,
      };
  
      return res.status(200).send(paginatedResult);
    } catch (error) {
      return res.status(500).send({
        message: "Unable to fetch song history",
        error: error.message,
      });
    }
  }
  
// POST method to add a song to the song history for a user
export async function addSongToHistory(req, res) {
  const { username, songId, songName, banner } = req.body;
  try {
    if (!username || !songId || !songName || !banner) {
      return res.status(400).send({
        message: "Invalid request body. Please provide all required fields.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).send({
        message: "User is not verified. Please verify your account first.",
      });
    }

    // Check if the song is already in the song history
    const existingSongIndex = user.songHistory.findIndex((song) => song.songId === songId);

    if (existingSongIndex !== -1) {
      // If the song already exists, remove it from its current position
      user.songHistory.splice(existingSongIndex, 1);
    }

    // Add the new song to the beginning of the song history
    user.songHistory.unshift({ songId, songName, banner });

    // Trim the song history to the desired limit (optional, if you want to keep a certain number of songs)
    const maxSongHistoryLength = 50; // For example, keeping only 50 most recent songs
    if (user.songHistory.length > maxSongHistoryLength) {
      user.songHistory = user.songHistory.slice(0, maxSongHistoryLength);
    }

    await user.save();

    return res.status(200).send({
      message: "Song added to the song history",
      song: { songId, songName, banner },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error in adding song to the song history",
      error: error.message,
    });
  }
}

  
  // DELETE method to remove a song from the song history for a user
  export async function removeSongFromHistory(req, res) {
    const { username, songId } = req.params;
    try {
      if (!username || !songId) {
        return res.status(400).send({
          message: "Invalid request parameters. Please provide username and songId.",
        });
      }
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }
  
      // Check if the user is verified
      if (!user.isVerified) {
        return res.status(400).send({
          message: "User is not verified. Please verify your account first.",
        });
      }
  
      // Find the index of the song in the song history
      const songIndex = user.songHistory.findIndex((song) => song.songId === songId);
      if (songIndex === -1) {
        return res.status(404).send({
          message: "Song not found in the song history",
        });
      }
  
      // Remove the song from the song history
      user.songHistory.splice(songIndex, 1);
      await user.save();
  
      return res.status(200).send({
        message: "Song removed from the song history",
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error in removing song from the song history",
        error: error.message,
      });
    }
  }