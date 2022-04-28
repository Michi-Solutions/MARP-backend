const nodemailer = require("nodemailer");
require('dotenv').config();

async function sendMail(token, userMail, param, text, textUrl, subject){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    console.log(token, userMail)
    let info = await transporter.sendMail({
        from: `${process.env.EMAIL_USER}`,
        to: userMail,
        subject: `${subject}`,
        html: `<p>${text}: <a href="http://localhost:3000/${param}/${token}">${textUrl}</a></p>`
    })
}

module.exports = sendMail;