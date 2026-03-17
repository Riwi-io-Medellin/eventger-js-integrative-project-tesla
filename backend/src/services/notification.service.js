const nodemailer = require("nodemailer");
const {getEmails, getNames, getPhone, getNotificationUser, readRepo, unreadRepo, createNotificationRepo, users, dailyNotification} = require('../repositories/notification.repository.js')
const twilio = require('twilio')

require('dotenv').config(); 

// Create transporter for nodemail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
})

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
async function sendEmail(emails, subject, message) {
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        bcc: emails,
        subject,
        html: message
    })
}

function date(date){
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const newDate = `${day}/${month}/${year} ${hour}:${minute}`
    return newDate;
}

async function notifyUsersEmail(eventInfo){

    // Get emails list
    const emails = await getEmails()
    let emailList = []

    for (let i=0; emails.rowCount>i; i++){
        emailList.push(emails.rows[i].email)
    }

    if (emailList.length ===0){
        return false;
    }

    // Get names of scenario, space, creator and discipline
    const names = await getNames(eventInfo.id)
    const name = names.rows[0]
    
    // 
    const subject = `!! Nuevo Evento: ${eventInfo.title}`
    const message=  `
        <html>
            <head>
                <style>
                    body {font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 20px;}
                    .email-container {background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        max-width: 650px;
                        margin: 0 auto;}
                    .email-header {text-align: center;
                        color: #007BFF;
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 20px;}
                    .email-content {font-size: 16px;
                        color: #333;}
                    .email-content p {margin: 10px 0;}
                    .event-details {margin-top: 20px;
                        padding: 15px;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        border: 1px solid #ddd;}
                    .event-details li {font-size: 14px;
                        margin-bottom: 8px;}
                    .footer {margin-top: 30px;
                        font-size: 12px;
                        text-align: center;
                        color: #888;}
                    .highlight {color: #007BFF;
                        font-weight: bold;}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                       ${eventInfo.title}
                    </div>
                    <div class="email-content">
                        <p>Se ha creado un nuevo evento con la siguiente información:</p>
                        <div class="event-details">
                            <ul style="list-style: none; padding: 0;">
                                <li><span class="highlight">Descripción:</span> ${eventInfo.description || 'N/A'}</li>
                                <li><span class="highlight">Inicio:</span> ${date(eventInfo.start_date)|| 'N/A'}</li>
                                <li><span class="highlight">Fin:</span> ${date(eventInfo.finish_date)|| 'N/A'}</li>
                                <li><span class="highlight">Disciplina:</span> ${name.discipline_name || 'N/A'}</li>
                                <li><span class="highlight">Escenario:</span> ${name.scenario_name || 'N/A'}</li>
                                <li><span class="highlight">Espacio:</span> ${name.space_name|| 'N/A'}</li>
                                <li><span class="highlight">Creador:</span> ${name.creator_name || 'N/A'}</li>
                            </ul>
                        </div>
                        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">Este es un correo automático. No respondas a este mensaje.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
    
    await sendEmail(emailList, subject, message)

}

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

async function notifyUsersPhone(eventInfo){
    // Get phone list
    const phones = await getPhone()
    let phoneList = []

    for (let i=0; phones.rows.length>i; i++){
        phoneList.push(phones.rows[i].phone_number)
    }

    if (phoneList.length ===0){
        console.log("NO PHONE NUMBERS ON THE LIST")
        return;
    }

    const names = await getNames(eventInfo.id)
    const name = names.rows[0]

    const message = `
        *${eventInfo.title}*

Se ha creado un nuevo evento con la siguiente información:
        
*Descripción:* ${eventInfo.description || 'N/A'}
*Inicio:* ${date(eventInfo.start_date) || 'N/A'}
*Fin:* ${date(eventInfo.finish_date) || 'N/A'}
*Disciplina:* ${name.discipline_name || 'N/A'}
*Escenario:* ${name.scenario_name || 'N/A'}
*Espacio:* ${name.space_name || 'N/A'}
*Creador:* ${name.creator_name || 'N/A'}

Este es un mensaje automático. No respondas a este mensaje.`;
    if(phoneList.length>0){
        for (let i=0; phoneList.length>i; i++){
            sendPhone(message, phoneList[i])
        }   
    }  
}

async function createNotification(event_id){
    const usersP = await users()
    const user= usersP.rows

    for (let i=0; user.length>i; i++){
        await createNotificationRepo(event_id, user[i].id);        
    }
}


async function reminderEmail(eventInfo){

    // Get emails list
    const emails = await getEmails()
    let emailList = []

    for (let i=0; emails.rowCount>i; i++){
        emailList.push(emails.rows[i].email)
    }

    if (emailList.length ===0){
        return false;
    }

    // Get names of scenario, space, creator and discipline
    const names = await getNames(eventInfo.id)
    const name = names.rows[0]
    
    // 
    const subject = `!! Recordatorio Evento: ${eventInfo.title}`
    const message=  `
        <html>
            <head>
                <style>
                    body {font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 20px;}
                    .email-container {background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        max-width: 650px;
                        margin: 0 auto;}
                    .email-header {text-align: center;
                        color: #007BFF;
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 20px;}
                    .email-content {font-size: 16px;
                        color: #333;}
                    .email-content p {margin: 10px 0;}
                    .event-details {margin-top: 20px;
                        padding: 15px;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        border: 1px solid #ddd;}
                    .event-details li {font-size: 14px;
                        margin-bottom: 8px;}
                    .footer {margin-top: 30px;
                        font-size: 12px;
                        text-align: center;
                        color: #888;}
                    .highlight {color: #007BFF;
                        font-weight: bold;}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                       ${eventInfo.title}
                    </div>
                    <div class="email-content">
                        <p>Le recordamos evento mañana:</p>
                        <div class="event-details">
                            <ul style="list-style: none; padding: 0;">
                                <li><span class="highlight">Descripción:</span> ${eventInfo.description || 'N/A'}</li>
                                <li><span class="highlight">Inicio:</span> ${date(eventInfo.start_date)|| 'N/A'}</li>
                                <li><span class="highlight">Fin:</span> ${date(eventInfo.finish_date)|| 'N/A'}</li>
                                <li><span class="highlight">Disciplina:</span> ${name.discipline_name || 'N/A'}</li>
                                <li><span class="highlight">Escenario:</span> ${name.scenario_name || 'N/A'}</li>
                                <li><span class="highlight">Espacio:</span> ${name.space_name|| 'N/A'}</li>
                                <li><span class="highlight">Creador:</span> ${name.creator_name || 'N/A'}</li>
                            </ul>
                        </div>
                        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">Este es un correo automático. No respondas a este mensaje.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
    
    await sendEmail(emailList, subject, message)

}

async function reminderService(){
    const daily = await dailyNotification()
    const dailies= daily.rows
    for (let i=0; dailies.length>i; i++){
        await reminderEmail(dailies[i]);        
    }
}

async function reminderPhone(eventInfo){
    // Get phone list
    const phones = await getPhone()
    let phoneList = []

    for (let i=0; phones.rows.length>i; i++){
        phoneList.push(phones.rows[i].phone_number)
    }

    if (phoneList.length ===0){
        console.log("NO PHONE NUMBERS ON THE LIST")
        return;
    }

    const names = await getNames(eventInfo.id)
    const name = names.rows[0]

    const message = ` *¡¡Recordatorio evento ${eventInfo.title}!!*

Le recordamos evento el día de mañana:
        
*Descripción:* ${eventInfo.description || 'N/A'}
*Inicio:* ${date(eventInfo.start_date) || 'N/A'}
*Fin:* ${date(eventInfo.finish_date) || 'N/A'}
*Disciplina:* ${name.discipline_name || 'N/A'}
*Escenario:* ${name.scenario_name || 'N/A'}
*Espacio:* ${name.space_name || 'N/A'}
*Creador:* ${name.creator_name || 'N/A'}

Este es un mensaje automático. No respondas a este mensaje.`;
    if(phoneList.length>0){
        for (let i=0; phoneList.length>i; i++){
            sendPhone(message, phoneList[i])
        }   
    }  
}

async function reminderPhoneService(){
    const daily = await dailyNotification()
    const dailies= daily.rows
    for (let i=0; dailies.length>i; i++){
        await reminderPhone(dailies[i]);        
    }
}

// 
async function webNotificationsByUser(user_id) {
    const notification = await getNotificationUser(user_id)
    return notification.rows;
}

// Function to turn a function into read

async function switchRead(option, id)  {
    const read = await readRepo(option, id)
    return read.rows;
}

module.exports ={notifyUsersEmail, notifyUsersPhone, createNotification, 
    reminderService, reminderPhoneService, webNotificationsByUser}