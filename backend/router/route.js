import { Router } from "express";
const router=Router()


/** import controllers */
import * as controller from '../controllers/controller.js'
import auth,{localVariables} from "../middleware/auth.js";
import  {sendMail} from '../controllers/mailer.js'


/** Register User */
router.post('/register',controller.register)

/** send the mail */
router.post('/sendMail',sendMail)

/** authenticate User */
router.post('/auth',controller.verifyUser,(req,res)=>{ res.end()})

/** login in app */
router.post('/login',controller.verifyUser,controller.login)

/** user by username */
router.get('/user/:username',controller.getUser)

/** generate random OTP */
router.get('/generateOTP',controller.verifyUser,localVariables,controller.generateOTP)

/** verify generated OTP */
router.get('/verifyOTP',controller.verifyUser,controller.verifyOTP)

/** reset all the variables */
router.get('/createResetSession',controller.createResetSession)

/** update user */
router.put('/updateUser',auth,controller.updateUser)

/** reset Password */
router.put('/resetPassword',controller.verifyUser,controller.resetPassword)

export default router