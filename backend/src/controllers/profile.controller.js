const {getEventsByUserService} = require('../services/profile.service.js');

// 1. Controller to get all scenarios

const getEventsByUser= async (req,res,next) =>{
    const {id}= req.params;

    try{
        const events= await getEventsByUserService(id);
        if (!events.length){
            return res.status(404).json({message: "The user haven't created an event"})
        }
        res.status(200).json(events)

    } catch (error){
        next(error)
    }
}

module.exports = {getEventsByUser}