const User = require('../Model/user')
const Token = require('../Model/token')
const jwt = require('jsonwebtoken')
// const expressJWT = require('express-jwt')
const cookieParser = require('cookie-parser')
const sendEmail = require('../utils/setEmail')
const crypto = require('crypto')
// const token = require('../Model/token')
// const user = require('../Model/user')


// to add user
exports.addUser = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    User.findOne({ email: user.email }, async (error, data) => {
        if (data == null) {
            user = await user.save()
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: user._id
            })
            token = await token.save()
            if (!token) {
                return res.json({ error: "something went wrong" })
            }
            // send verification email
            const url = process.env.FRONTEND_URL + '/email/confirmation/' + token.token

            sendEmail({
                from: "noreply@ourpage.com",
                to: user.email,
                subject: "Verification Email",
                text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
                html: `<button><a href='${url}'>Verify</button>`
            })

            if (!user) {
                return res.status(400).json({ error: "something went wrong" })
            }
            else {
                res.send(user)
            }
        }
        else {
            return res.status(400).json({ error: "Email already exists." })

        }
    })

}

// resend verificaction email
exports.resendVerfication = async (req, res) =>{
    // find user
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error:"The email is not registered. Please register"})
    }
    // check if user is already verified
    if(user.isVerified){
        return res.status(400).json({error:"User already verified. Login to continue"})
    }
    //create token
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.json({ error: "something went wrong" })
    }
    // send verification email
    const url = process.env.FRONTEND_URL + '/email/confirmation/' + token.token

    sendEmail({
        from: "noreply@ourpage.com",
        to: user.email,
        subject: "Verification Email",
        text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
        html: `<button><a href='${url}'>Verify</button>`
    })
    
    res.json({message:"Verfication link has been sent to your email."})


}


// verify user
exports.verifyUser = (req, res) => {
    // to check token
    Token.findOne({ token: req.params.token }, (error, token) => {
        if (error || !token) {
            return res.status(400).json({ error: " invalid token or token may have expired." })
        }

        User.findOne({ _id: token.userId }, (error, user) => {
            if (error || !user) {
                return res.status(400).json({ error: " unable to find user." })
            }

            if (user.isVerified) {
                return res.status(400).json({ error: "user already verified, please login to continue." })
            }

            // verify user
            user.isVerified = true
            user.save(err => {
                if (err) {
                    return res.status(400).json({ error: err })
                }
                res.json({ message: "congratulations, your account is verified." })
            }
            )
        })
    })
}

// signin
exports.userSignin = async (req, res) => {
    const { email, password } = req.body
    // check if email is registered or not 
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ error: " email not found/registered" })
    }
    //check password to authenticate
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: " email and password does not match" })
    }
    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "user not verified. please verify to continue" })
    }

    //generate token using user_id and jwt
    const token = jwt.sign({ _id: user._id, user: user.role }, process.env.JWT_SECRET)

    res.cookie('myCookie', token, { expire: Date.now() + 999999 })

    // return information to front end
    const { _id, name, role } = user
    return res.json({
        token, user: { name, email, role, _id }
        // return res.json({token, name:user.name, email:user.email, id:user._id

    })
}

// user sign out
exports.userSignout = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: "signed out successfully." })
}