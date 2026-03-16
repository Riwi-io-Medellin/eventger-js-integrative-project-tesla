const pool = require('../db/sql.js');

// 1. Function to Show all spaces
async function getScenariosRepository(){
    const query= `select name, location from public.scenario`
    return pool.query(query);
} 

// 2. Check if the space already exists in a scenario

async function checkScenarioRepository(name){
    const checkQuery= `select * 
                        from public.scenario 
                        where name=$1`;
    return pool.query(checkQuery,[name])
}

//3. Create a new space

async function createScenarioRepository(name, location){
    const query= `insert into public.scenario (name, location)
                    values ($1, $2)
                    RETURNING *`
    return pool.query(query,[name,location]);
}

//4. Delete a space

async function deleteScenarioRepository(id){
    const query= `delete from public.scenario
                   where id=$1`;
    return pool.query(query,[id]);
}

// 5. Update an space
async function updateScenarioRepository(name, location, id){
    const query= `UPDATE public.scenario
                    SET name= $1, location=$2 
                    WHERE id= $3
                    RETURNING *`
    return pool.query(query, [name,location,id]);
}

module.exports = {getScenariosRepository, createScenarioRepository, checkScenarioRepository, 
    deleteScenarioRepository, updateScenarioRepository}
