import JWT from "jsonwebtoken"
import ENV from '../config.js'


// auth middleware
export default async function(req,res,next)
{
    try {
        
        //access authorize header to validate request
        const token=req.headers.authorization.split(" ")[1]

        //retrieve the user details of the login user
        const decodedToken =await JWT.verify(token,ENV.JWT_SECRET)
        req.user=decodedToken


        next()

    } catch (error) {
        res.status(401).send({err:"authentication failed"})
    }
}


export function localVariables(req,res,next)
{
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next()
}