const {webNotificationsByUser, switchRead} = require("../services/notification.service.js")

// Controller to get all notifications of the user
const webNotificationsByUserCont = async (req, res, next) =>{
    const {id}= req.params;
    try {
        const response = await webNotificationsByUser(id)
        res.status(200).json(response)

    } catch (errpr) {
        next(error)
    }
}

// Controller to change status read of a notification
const read= async(req, res, next)=>{
    const {id} = req.params;
    const {is_read} = req.body;
    
    const validStatus= [true, false];

    // Verify if the user entered a valid status read
    if (!validStatus.includes(is_read)){
        return  res.status(400).json({ message: "Invalid read status" });
    }

    try{
        const response= await switchRead(true, id);
        res.json({message: "Status read updated", data: response});
    } catch (error){
        next(error)
    }

}

module.exports =  {webNotificationsByUserCont, read}

