import { Router } from "express";
import * as controller from "../controllers/control.js";
import Auth from "../middleware/Authenticate.js";
import validateEmail from "../middleware/EmailValidate.js";
import * as MusicControl from "../controllers/LikedSongs.control.js"
import * as SongHistory from "../controllers/SongHistory.control.js"
import * as UserContol from "../controllers/User.control.js"
import { isVerified } from "../middleware/VerifiedUser.js";
const router = Router();

// POST methods
router.route('/register').post(validateEmail, controller.register);
router.route('/verify-register').post(controller.verifyRegister);
router.route('/reset-password').post(controller.initiatePasswordReset);
router.route('/verify-reset-password').post(validateEmail,controller.verifyPasswordReset);
router.route('/login').post(isVerified,controller.login);
router.route("/add-liked-songs").post(isVerified,Auth,MusicControl.addLikedSong);
router.route("/add-song-history").post(isVerified,Auth,SongHistory.addSongToHistory); 

// GET methods
router.route('/user/:username').get(Auth,UserContol.getUser);
router.route("/liked-songs/:username").get(isVerified,Auth,MusicControl.getLikedSongs);
router.route("/song-history/:username").get(isVerified,Auth,SongHistory.getSongHistory); 

// PUT methods
router.route('/update-user').put(isVerified,Auth,UserContol.updateUser);

// DELETE methods
router.route("/delete-liked-songs/:username/:songId").delete(isVerified,Auth,MusicControl.removeLikedSong);
router.route("/delete-song-history/:username/:songId").delete(isVerified,Auth,SongHistory.removeSongFromHistory); 


export default router;
