import { Router } from "express";
const router = Router()

// post methods
router.route('/register').post((req,res)=>res.json("Register route"))
router.route('/login').post((req,res)=>res.json("Login Route"))
// get methods


// put methods

export default Router;