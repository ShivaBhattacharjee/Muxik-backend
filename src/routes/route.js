import { Router } from "express";
import Auth from "../middleware/Authenticate.js";
import validateEmail from "../middleware/EmailValidate.js";
import * as MusicControl from "../controllers/LikedSongs.control.js"
import * as SongHistory from "../controllers/SongHistory.control.js"
import * as UserControl from "../controllers/User.control.js"
import * as ResetControl from "../controllers/ResetPassword.control.js"
import { isVerified } from "../middleware/VerifiedUser.js";
const router = Router();

// POST methods
router.route('/register').post(validateEmail, UserControl.register);
router.route('/verify-register').post(UserControl.verifyRegister);
router.route('/resend-email').post(UserControl.resendVerificationEmail);
router.route('/reset-password').post(ResetControl.initiatePasswordReset);
router.route('/verify-reset-password').post(validateEmail,ResetControl.verifyPasswordReset);
router.route('/login').post(isVerified,UserControl.login);
router.route("/add-liked-songs").post(isVerified,Auth,MusicControl.addLikedSong);
router.route("/add-song-history").post(isVerified,Auth,SongHistory.addSongToHistory); 

// GET methods
router.route('/user/:username').get(Auth,UserControl.getUser);
router.route("/liked-songs/:username").get(isVerified,Auth,MusicControl.getLikedSongs);
router.route("/song-history/:username").get(isVerified,Auth,SongHistory.getSongHistory); 

// PUT methods
router.route('/update-user').put(Auth,UserControl.updateUser);

// DELETE methods
router.route("/delete-liked-songs/:username/:songId").delete(isVerified,Auth,MusicControl.removeLikedSong);
router.route("/delete-song-history/:username/:songId").delete(isVerified,Auth,SongHistory.removeSongFromHistory); 


export default router;
