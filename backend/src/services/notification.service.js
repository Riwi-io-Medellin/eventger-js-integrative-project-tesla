const {sendEmail} = require("../utils/nodemailer.js")
const {getEmails, getNames, getPhone, getNotificationUser, readRepo, unreadRepo, createNotificationRepo, users, dailyNotification} = require('../repositories/notification.repository.js')
const {sendPhone} = require("../infrastructure/twilio.client.js")


// 1. Function to normalize dates
function date(date){
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const newDate = `${day}/${month}/${year} ${hour}:${minute}`
    return newDate;
}

// 2. Function to notify a user by email when an event is created
async function notifyUsersEmail(eventInfo){

    // Get emails list
    const emails = await getEmails()
    let emailList = []

    // Add emails into a list
    for (let i=0; emails.rowCount>i; i++){
        emailList.push(emails.rows[i].email)
    }

    // Verify if there're emails
    if (emailList.length ===0){
        return false;
    }

    // Get names of scenario, space, creator and discipline
    const names = await getNames(eventInfo.id)
    const name = names.rows[0]
    
    // Subject message
    const subject = `!! Nuevo Evento: ${eventInfo.title}`

    // Message structure html
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
                                <li><span class="highlight">Descripción:</span> ${eventInfo.description || ''}</li>
                                <li><span class="highlight">Inicio:</span> ${date(eventInfo.start_date)|| ''}</li>
                                <li><span class="highlight">Fin:</span> ${date(eventInfo.finish_date)|| ''}</li>
                                <li><span class="highlight">Disciplina:</span> ${name.discipline_name || ''}</li>
                                <li><span class="highlight">Escenario:</span> ${name.scenario_name || ''}</li>
                                <li><span class="highlight">Espacio:</span> ${name.space_name|| ''}</li>
                                <li><span class="highlight">Creador:</span> ${name.creator_name || ''}</li>
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

// 3. Function to notify user by whatsapp when an event is created
async function notifyUsersPhone(eventInfo){

    // Get phone number of each user
    const phones = await getPhone()
    let phoneList = []

    // Add all phones to the list
    for (let i=0; phones.rows.length>i; i++){
        phoneList.push(phones.rows[i].phone_number)
    }

    //Verify that there are phone numbers to send the message
    if (phoneList.length ===0){
        console.log("NO PHONE NUMBERS ON THE LIST")
        return;
    }

    // Get names of the discipline, scenario, space and creator name
    const names = await getNames(eventInfo.id)
    const name = names.rows[0]

    // Message to send
    const message = `
        *${eventInfo.title}*

Se ha creado un nuevo evento con la siguiente información:
        
*Descripción:* ${eventInfo.description || ''}
*Inicio:* ${date(eventInfo.start_date) || ''}
*Fin:* ${date(eventInfo.finish_date) || ''}
*Disciplina:* ${name.discipline_name || ''}
*Escenario:* ${name.scenario_name || ''}
*Espacio:* ${name.space_name || ''}
*Creador:* ${name.creator_name || ''}

Este es un mensaje automático. No respondas a este mensaje.`;

    //send message for each phone number of the list
    if(phoneList.length>0){
        for (let i=0; phoneList.length>i; i++){
            sendPhone(message, phoneList[i])
        }   
    }  
}

// 4. Function to create a notification for each user
async function createNotification(event_id){
    // get all users id
    const usersP = await users()
    const user= usersP.rows

    // Create the notification for each user id
    for (let i=0; user.length>i; i++){
        await createNotificationRepo(event_id, user[i].id);        
    }
}

// 5. Function to send a Reminder by email
async function reminderEmail(eventInfo){

    // Get emails list
    const emails = await getEmails()
    let emailList = []

    // Add emails to the list
    for (let i=0; emails.rowCount>i; i++){
        emailList.push(emails.rows[i].email)
    }
    
    // Verify emails on the list
    if (emailList.length ===0){
        return false;
    }

    // Get names of scenario, space, creator and discipline
    const names = await getNames(eventInfo.id)
    const name = names.rows[0]
    
    // Message structure
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
                                <li><span class="highlight">Descripción:</span> ${eventInfo.description || ''}</li>
                                <li><span class="highlight">Inicio:</span> ${date(eventInfo.start_date)|| ''}</li>
                                <li><span class="highlight">Fin:</span> ${date(eventInfo.finish_date)|| ''}</li>
                                <li><span class="highlight">Disciplina:</span> ${name.discipline_name || ''}</li>
                                <li><span class="highlight">Escenario:</span> ${name.scenario_name || ''}</li>
                                <li><span class="highlight">Espacio:</span> ${name.space_name|| ''}</li>
                                <li><span class="highlight">Creador:</span> ${name.creator_name || ''}</li>
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

// 6. reminder for daily notification email
async function reminderService(){
    //get notifications of next day events
    const daily = await dailyNotification()
    const dailies= daily.rows

    //Send a reminder for each notification found
    for (let i=0; dailies.length>i; i++){
        await reminderEmail(dailies[i]);        
    }
}

// 7. Function to send a Reminder by phone
async function reminderPhone(eventInfo){
    // Get phone list
    const phones = await getPhone()
    let phoneList = []

    // Add phones to the list
    for (let i=0; phones.rows.length>i; i++){
        phoneList.push(phones.rows[i].phone_number)
    }

    //Verify the list have phones
    if (phoneList.length ===0){
        console.log("NO PHONE NUMBERS ON THE LIST")
        return;
    }

    const names = await getNames(eventInfo.id)
    const name = names.rows[0]

    // Whatsapp messagge
    const message = ` *¡¡Recordatorio evento ${eventInfo.title}!!*

Le recordamos evento el día de mañana:
        
*Descripción:* ${eventInfo.description || ''}
*Inicio:* ${date(eventInfo.start_date) || ''}
*Fin:* ${date(eventInfo.finish_date) || ''}
*Disciplina:* ${name.discipline_name || ''}
*Escenario:* ${name.scenario_name || ''}
*Espacio:* ${name.space_name || ''}
*Creador:* ${name.creator_name || ''}

Este es un mensaje automático. No respondas a este mensaje.`;

    // Send reminder for each phone.
    if(phoneList.length>0){
        for (let i=0; phoneList.length>i; i++){
            sendPhone(message, phoneList[i])
        }   
    }  
}

// 8. reminder for daily notification phone
async function reminderPhoneService(){
    const daily = await dailyNotification()
    const dailies= daily.rows
    for (let i=0; dailies.length>i; i++){
        await reminderPhone(dailies[i]);        
    }
}

// 9. Get all notifications filtered by user
async function webNotificationsByUser(user_id) {
    const notification = await getNotificationUser(user_id)
    return notification.rows;
}

// 10. Function to turn a function into read

async function switchRead(option, id)  {
    const read = await readRepo(option, id)
    return read.rows;
}

module.exports ={notifyUsersEmail, notifyUsersPhone, createNotification, 
    reminderService, reminderPhoneService, webNotificationsByUser,switchRead}