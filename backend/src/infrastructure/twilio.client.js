const twilio = require('twilio')
require('dotenv').config(); 

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

async function sendPhone(message, phones){
    try{
        const mess = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+57${phones}`,
            body: message
        })
    } catch(error){
        console.error("Error sending message", error)
    }
}

module.exports ={sendPhone}