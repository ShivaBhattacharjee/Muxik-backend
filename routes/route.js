import { Router } from "express";
import * as controller from "../controllers/control.js";
import Auth from "../middleware/Authenticate.js";
import validateEmail from "../middleware/EmailValidate.js";

const router = Router();

// POST methods
router.route('/register').post(validateEmail, controller.register); //tested working
router.route('/verify-register').post(controller.verifyRegister); //testing working
router.route('/reset-password').post(controller.initiatePasswordReset);
router.route('/verify-reset-password').post(controller.verifyPasswordReset); 
router.route('/login').post(controller.login); //tested working

// GET methods
router.route('/user/:username').get(controller.getUser);
router.route('/reset-session').get(controller.resetSession);

// PUT methods
router.route('/update-user').put(Auth, controller.updateUser); //tested working 

export default router;
