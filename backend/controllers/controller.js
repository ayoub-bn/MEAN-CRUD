import UserModel from "../model/user.model.js"
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken"
import ENV from '../config.js'
import otpGenerator from 'otp-generator'

//middleware for verifyUser
export async function verifyUser(req,res,next)
{
    try {
        
        const {username}=req.method=="GET" ? req.query : req.body

        // check the user existance
        let exist = await UserModel.findOne({username})
        if(!exist)
        return res.status(404).send({error:"cannot find user"})
        next()

    } catch (error) {
        return res.status(404).send({err:"authentication error"})
    }
}



export async function register(req,res){

    try {
        const { username, password, profile, email } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send(error);
    }

}

export async function login(req, res) {
    const { username, password } = req.body
    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck)
                            return res.status(400).send({ err: "don't have password" })

                        // Create JWT Token
                        const token = Jwt.sign({
                                      userId: user.id,
                                      username: user.username
                                    }, ENV.JWT_SECRET, { expiresIn: "24h" })

                        return res.status(200).send({
                            msg:"login successful",
                            username:user.username,
                            token
                        })

                    })
                    .catch(err => { return res.status(404).send({ err: "incorrect password" }) })
            })
            .catch(err => { return res.status(404).send({ error: "username not found" }) })
    } catch (error) {
        return res.status(500).send(err)
    }
}

export async function getUser(req, res) {
    
    const username=req.params

    try {
        if(!username)
        return res.status(501).send({err:"invalid username"})

        UserModel.findOne(username,(err,user)=>{
            if(err) return res.status(500).send(err)
            if(!user) return res.status(501).send({err:"cannot find the user"})

            /** remove password and unnecessary data from user  */
            const {password, ...rest}=Object.assign({},user.toJSON())


            return res.status(201).send(rest)
        })


    } catch (error) {
        return res.status(404).send({err:"cannot find user data"})
    }

}

export async function updateUser(req, res) {
    try {
        
        //const id=req.query.id
        const {userId}=req.user
        if(userId)
        {
            const body =req.body

            // update data
            UserModel.updateOne({_id:userId},body,(err,data)=>{
                if(err) throw err

                return res.status(201).send({msg:"user updated"})
            })
        }
        else return res.status(401).send({err:"user not found"})
    } catch (error) {
        res.status(401).send(error)
    }
}

export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
    res.status(201).send({code : req.app.locals.OTP})
}

export async function verifyOTP(req, res) {
    const {code} =req.query
    if(parseInt(req.app.locals.OTP)==parseInt(code))
    {
        req.app.locals.OTP=null //reset OTP values
        req.app.locals.resetSession=true //start session to reset password
        return res.status(201).send({msg:"verified successfully"})
    }
    return res.status(400).send({err:"invalid OTP"})
}

export async function createResetSession(req, res) {
    if (req.app.locals.resetSession)
    {
        return res.status(201).send({flag: req.app.locals.resetSession})
    }
    return res.status(440).send({error:"session expired"})
}

export async function resetPassword(req, res) {
    try {

        if(!req.app.locals.resetSession)
            return res.status(440).send({error:"session expired"})

        const {username,password}=req.body
        try {
            UserModel.findOne({username})
            .then(user=>{
                bcrypt.hash(password,10)
                .then(hashedPassword=>{
                    UserModel.updateOne({username:user.username},
                        {password:hashedPassword},(err,data)=>{
                            if(err) throw err
                            req.app.locals.resetSession=false
                            return res.status(201).send({msg:"password updated"})
                        })
                })
                .catch(err=>{return res.status(500).send({err:"unaible to hash password"})})
            })
            .catch(err=>{return res.status(404).send({err : "username not found"})})
        } catch (error) {
            return res.status(500).send({error})
        }
    } catch (error) {
        return res.status(401).send({error})
    }
}















