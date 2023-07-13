import { Router } from "express";
import * as controller from "../controllers/control.js"
const router = Router()
import Auth , {localVariables} from "../middleware/Authenticate.js";
// import RegisterMailer from "../Email/RegisterUserEmail.js";
// post methods
import validateEmail from "../middleware/EmailValidate.js";
router.route('/register').post(validateEmail,controller.register)
// Verify user registration
router.route('/verify-register').post(controller.verifyRegister);

router.route('/register-mail').post()
router.route('/authenticate').post((req,res)=>res.end())
router.route('/login').post(controller.login)
router.route('/add-liked-songs').post()

// get methods
router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get(localVariables, controller.generateOTP);
router.route('/verifyOTP').get(validateEmail,controller.verifyOTP)
router.route('/createResetSession').get(controller.resetSession)
router.route('/get-playlist').get()
router.route('/get-liked-songs').get()

// put methods
router.route('/updateuser').put(Auth, controller.updateUser)
router.route('/resetPassword').put(controller.passwordReset)


export default router;