import { Router } from "express";
import * as controller from "../controllers/control.js";
import Auth from "../middleware/Authenticate.js";
import validateEmail from "../middleware/EmailValidate.js";
import * as MusicControl from "../controllers/LikedSongs.control.js"
import * as SongHistory from "../controllers/SongHistory.control.js"
import * as UserContol from "../controllers/User.control.js"
const router = Router();

// POST methods
router.route('/register').post(validateEmail, controller.register);
router.route('/verify-register').post(controller.verifyRegister);
router.route('/reset-password').post(controller.initiatePasswordReset);
router.route('/verify-reset-password').post(validateEmail, controller.verifyPasswordReset);
router.route('/login').post(controller.login);
router.route("/add-liked-songs").post(Auth,MusicControl.addLikedSong);
router.route("/add-song-history").post(Auth,SongHistory.addSongToHistory); 

// GET methods
router.route('/user/:username').get(Auth,UserContol.getUser);
router.route("/liked-songs/:username").get(Auth,MusicControl.getLikedSongs);
router.route("/song-history/:username").get(Auth,SongHistory.getSongHistory); 

// PUT methods
router.route('/update-user').put(Auth, UserContol.updateUser);

// DELETE methods
router.route("/delete-liked-songs/:username/:songId").delete(Auth,MusicControl.removeLikedSong);
router.route("/delete-song-history/:username/:songId").delete(Auth,SongHistory.removeSongFromHistory); 


export default router;
