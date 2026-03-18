const nodemailer = require("nodemailer")

// Gmail Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 5000,  // 5s para conectar al servidor SMTP
    greetingTimeout:  5000,   // 5s para el saludo inicial
    socketTimeout:    10000   // 10s de inactividad máxima
})

// Send user regsitration
async function send(data) {
    const { addressee, subject, description } = data

    return await transporter.sendMail({
        from: process.env.EMAIL_USER, // Sender
        to: addressee,
        subject,
        html: description
    })
}


async function sendImportant(data){ 
    const { addressee, subject, description } = data

    return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: addressee,
        subject,
        html: description,
        header: {
            "X-Priority": "1",
            "X-MSMail-Priority": "High",
            "Importance": "high"
        }
    })
}

// Send Email of event creation

async function sendEmail(emails, subject, message) {
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        bcc: emails,
        subject,
        html: message
    })
}

module.exports = { send, sendImportant, sendEmail }