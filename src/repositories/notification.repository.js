const {pool} = require('../db/sql.js')

// 1. FUnction to get all emails

async function getEmails(){
    const query = `select email
                    from public.user
                    where is_active= true;`
    return pool.query(query)
}

module.exports = {getEmails}