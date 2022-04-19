const nodemailer = require("nodemailer");
require('dotenv').config();

async function sendEmail(token, userMail){
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
        subject: 'Reset Password',
        html: `<p>Click on the link to reset your password: <a href="http://localhost:3000/reset/${token}">Mudar Senha</a></p>`
    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}

module.exports = sendEmail;