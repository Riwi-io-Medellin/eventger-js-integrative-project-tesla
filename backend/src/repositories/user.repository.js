// it's like a clouser but inside a class
// manage all user data in db

const { pool } = require('./../db/sql')

class UserRepository {
    async findUser(email) {
        const result = await pool.query("SELECT * FROM user WHERE email = $1", [email])

        
    }
}