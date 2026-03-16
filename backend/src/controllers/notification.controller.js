const {webNotificationsByUser} = require("../services/notification.service.js")

async function webNotificationsByUserCont(req, res, next) {
    const {user_id}= req.params
    try {
        const response = await webNotificationsByUser(user_id)
        res.status(200).json(response)

    } catch (errpr) {
        next(error)
    }
}

module.exports =  {webNotificationsByUserCont}

