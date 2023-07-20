import User from "../models/user.model.js";
// get liked songs
export  async function getLikedSongs(req, res) {
    const { username } = req.params;
    const { page = 1 } = req.query; // Default page number is 1
    const limit = 12; // Number of songs per page
  
    try {
      if (!username) {
        return res.status(400).send({
          message: "Invalid username",
        });
      }
  
      // Retrieve the user with the `isVerified` field
      const user = await User.findOne({ username }).select("likedSongs isVerified").exec();
  
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
      const songs = user.likedSongs.slice(startIndex, endIndex);
  
      // Create an object to hold the paginated results
      const paginatedResult = {
        songs,
        nextPage: user.likedSongs.length > endIndex ? true : false,
      };
  
      return res.status(200).send(paginatedResult);
    } catch (error) {
      return res.status(500).send({
        message: "Unable to fetch liked songs",
        error: error.message,
      });
    }
  }
  
  
  // POST method to add a liked song for a user
  export  async function addLikedSong(req, res) {
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
  
      // Check if the song already exists in the liked songs list
      const existingSong = user.likedSongs.find((song) => song.songId === songId);
      if (existingSong) {
        return res.status(400).send({
          message: "Song already exists in the liked songs list",
        });
      }
  
      // Add the new song to the liked songs list
      user.likedSongs.push({ songId, songName, banner });
      await user.save();
  
      return res.status(200).send({
        message: "Song added to the liked songs list",
        song: { songId, songName, banner },
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error in adding liked song",
        error: error.message,
      });
    }
  }
  
  // DELETE method to remove a liked song for a user
  export async function removeLikedSong(req, res) {
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
  
      // Find the index of the song in the liked songs list
      const songIndex = user.likedSongs.findIndex((song) => song.songId === songId);
      if (songIndex === -1) {
        return res.status(404).send({
          message: "Song not found in the liked songs list",
        });
      }
  
      // Remove the song from the liked songs list
      user.likedSongs.splice(songIndex, 1);
      await user.save();
  
      return res.status(200).send({
        message: "Song removed from the liked songs list",
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error in removing liked song",
        error: error.message,
      });
    }
  }
  