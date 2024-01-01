import { Router } from "express";
import {
  getLikedSongs,
  addLikedSong,
  removeLikedSong,
} from "../controllers/LikedSongs.control.js";

import {
  addSongToHistory,
  getSongHistory,
  removeSongFromHistory,
} from "../controllers/SongHistory.control.js";

import { UpdateUser, getUser } from "../controllers/User.control.js";

import jwtTokenCheck from "../middleware/JwtTokenCheck.js";

const UserRoutes = Router();

UserRoutes.route("/liked-songs")
  .all(jwtTokenCheck)
  .get((req, res) => {
    getLikedSongs(req, res);
  })
  .post((req, res) => {
    addLikedSong(req, res);
  })
  .delete((req, res) => {
    removeLikedSong(req, res);
  });

UserRoutes.route("/history")
  .all(jwtTokenCheck)
  .get((req, res) => {
    getSongHistory(req, res);
  })
  .post((req, res) => {
    addSongToHistory(req, res);
  })
  .delete((req, res) => {
    removeSongFromHistory(req, res);
  });

UserRoutes.route("/user-info")
  .all(jwtTokenCheck)
  .get((req, res) => {
    getUser(req, res);
  })
  .put((req, res) => {
    UpdateUser(req, res);
  });

export default UserRoutes;
