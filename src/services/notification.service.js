import nodemailer from "nodemailer"
const {getEmails} = require('../repositories/notification.repository.js')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export async function sendEmail(emails, subject, message) {
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        bcc: emails,
        subject,
        html: message
    })
}

export async function notifyUsers(eventInfo){

    // Get emails list
    const emails = await getEmails()
    let emailList = []

    for (let i=0; emails.rowCount>i; i++){
        emailList.push(emails.rows[i])
    }

    if (emailList.length ===0){
        return false;
    }

    // 
    const subject = eventInfo.title
    const message= `  <html>
                        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
                        <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #007BFF; text-align: center;">Nuevo Evento Creado</h2>
                            <p style="font-size: 16px; color: #333;">Se ha creado un nuevo evento con la siguiente información:</p>
                            <ul style="list-style: none; padding: 0;">
                            <li><strong>Título:</strong> ${eventInfo.title}</li>
                            <li><strong>Descripción:</strong> ${eventInfo.description}</li>
                            <li><strong>Inicio:</strong> ${eventInfo.start_date}</li>
                            <li><strong>Fin:</strong> ${eventInfo.finish_date}</li>
                            <li><strong>Disciplina ID:</strong> ${eventInfo.discipline_id}</li>
                            <li><strong>Escenario ID:</strong> ${eventInfo.scenario_id}</li>
                            <li><strong>Espacio ID:</strong> ${eventInfo.space_id}</li>
                            <li><strong>Creador ID:</strong> ${eventInfo.creator_id}</li>
                            </ul>
                            <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">Este es un correo automático. No respondas a este mensaje.</p>
                        </div>
                        </body>
                    </html>`
    
    await sendEmail(emailList, subject, message)

}

module.exports ={notifyUsers}