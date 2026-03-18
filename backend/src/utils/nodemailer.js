const nodemailer = require("nodemailer")

// Gmail Transporter — forced IPv4 (Render free tier has no IPv6)
const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
        user: "apikey",
        pass: process.env.TWILIO_SENDGRID_KEY
    }
})

async function send(data) {
    const { addressee, subject, description } = data
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: addressee,
        subject,
        html: description
    })
}

async function sendImportant(data) {
    const { addressee, subject, description } = data
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: addressee,
        subject,
        html: description,
        headers: {
            "X-Priority": "1",
            "X-MSMail-Priority": "High",
            "Importance": "high"
        }
    })
}

async function sendEmail(emails, subject, message) {
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        bcc: emails,
        subject,
        html: message
    })
}

module.exports = { send, sendImportant, sendEmail }
