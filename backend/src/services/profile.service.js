const {getEventsByUserRepo} = require('../repositories/profile.repository.js');

// 1. Function get events by user
async function getEventsByUserService(id) {
    const response = await getEventsByUserRepo(id);
    return response.rows;
} 

module.exports= {getEventsByUserService}