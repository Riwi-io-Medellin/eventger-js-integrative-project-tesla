const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM || "EventgerJS <onboarding@resend.dev>"

async function send(data) {
    const { addressee, subject, description } = data
    return resend.emails.send({
        from: FROM,
        to: addressee,
        subject,
        html: description
    })
}

async function sendImportant(data) {
    const { addressee, subject, description } = data
    return resend.emails.send({
        from: FROM,
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
    return resend.emails.send({
        from: FROM,
        bcc: emails,
        subject,
        html: message
    })
}

module.exports = { send, sendImportant, sendEmail }
