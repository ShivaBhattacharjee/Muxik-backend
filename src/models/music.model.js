// mongo db schema to store history liked songs and playlist
import mongoose from "mongoose";

export const LikedSongSchema = new mongoose.Schema({
  songId: {
    type: String,
    required: true,
  },
  songName: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
});