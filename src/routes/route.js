import { Router } from "express";
import * as controller from "../controllers/control.js";
import Auth from "../middleware/Authenticate.js";
import validateEmail from "../middleware/EmailValidate.js";

const router = Router();

// POST methods
router.route('/register').post(validateEmail, controller.register); //tested working
router.route('/verify-register').post(controller.verifyRegister); //testing working
router.route('/reset-password').post(controller.initiatePasswordReset);
router.route('/verify-reset-password').post(validateEmail,controller.verifyPasswordReset); 
router.route('/login').post(controller.login); //tested working

// GET methods
router.route('/user/:username').get(controller.getUser);
// router.route('/reset-session').get(controller.resetSession);
router.route('/liked-songs/:username').get()

// PUT methods
router.route('/update-user').put(Auth, controller.updateUser); //tested working 

// GET method to fetch liked songs for a user
router.route("/liked-songs/:username").get(controller.getLikedSongs);

// POST method to add a liked song for a user
router.route("/add-liked-songs").post(controller.addLikedSong);

// DELETE method to remove a liked song for a user
router.route("/delete-liked-songs/:username/:songId").delete(controller.removeLikedSong);


export default router;
