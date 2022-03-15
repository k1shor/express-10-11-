const express = require('express')
const { addUser,userSignin, userSignout, verifyUser, resendVerification, forgetPassword, resetPassword } = require('../Controller/userController')
// const sendEmail = require('../utils/setEmail')
const { userValidation } = require('../Validation/userValidation')
const router = express.Router()

router.post('/addUser',userValidation,addUser)
router.post('/signin',userSignin)
router.get('/signout',userSignout)
router.post('/confirmation/:token', verifyUser)
router.post('/resendVerification',resendVerification)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token', resetPassword)

module.exports = router