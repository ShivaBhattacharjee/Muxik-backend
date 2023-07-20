import mongoose from "mongoose";

const LikedSongsSchema = new mongoose.Schema({
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

const SongHistorySchema = new mongoose.Schema({
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
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: "",
  },
  resetPasswordOTP: {
    type: String,
    default: null,
  },
  resetPasswordExpiration: {
    type: Date,
    default: null,
  },
  likedSongs: {
    type: [LikedSongsSchema],
    default: [],
  },
  songHistory: {
    type: [SongHistorySchema],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
