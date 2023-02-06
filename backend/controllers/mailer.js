import nodemailer from 'nodemailer'
import mailgen from 'mailgen'

import ENV from '../config.js'


// https://ethereal.email/create
let  nodeConfig={
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: ENV.EMAIL, // generated ethereal user
      pass: ENV.PASSWORD // generated ethereal password
    },
}

let transporter=nodemailer.createTransport(nodeConfig)

let mailGenerator=new mailgen({
    theme:"default",
    product:{
        name:"MailGen",
        link:"https://mailgen.js"
    }
})



export const sendMail=async (req,res)=>{
    const { username, userEmail, text, subject }=req.body

    //body of the email
    var email={
        body:{
            name:username,
            intro:text || "welcome to MERN_LoginSystem",
            outro:"need help or have any questions ?, just reply to this email..."
        }
    }


    var emailBody=mailGenerator.generate(email)
    let message ={
        from:ENV.EMAIL,
        to:userEmail,
        subject:subject || "Sigup success",
        html:emailBody
    }

    //send the userEmail
    transporter.sendMail(message)
    .then(()=>{
        return res.status(200).send({msg:"u should receive an email from us"})
    })
    .catch(err=>res.status(500).send({err}))



}

