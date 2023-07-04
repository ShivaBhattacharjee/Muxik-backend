import { Router } from "express";
import * as controller from "../controllers/control.js"
const router = Router()

// post methods

router.route('/register').post(controller.register)
// router.route('/register-mail').post()
router.route('/authenticate').post((req,res)=>res.end())
router.route('/login').post(controller.login)

// get methods
router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get(controller.generateOTP)
router.route('/verifyOTP').get(controller.verifyOTP)
router.route('/createResetSession').get(controller.resetSession)

// put methods
router.route('/updateuser').put(controller.updateUser)
router.route('/resetPassword').get(controller.passwordReset)
export default router;