const pool = require('../db/sql.js');

// 1. Function to Show all scenarios
async function getScenariosRepository(){
    const query= `select name, location from public.scenario`
    return pool.query(query);
} 

// 2. Check if the scenario name already exists

async function checkScenarioRepository(name){
    const checkQuery= `select * 
                        from public.scenario 
                        where name=$1`;
    return pool.query(checkQuery,[name])
}

//3. Create a new scenario

async function createScenarioRepository(name, location){
    const query= `insert into public.scenario (name, location)
                    values ($1, $2)
                    RETURNING *`
    return pool.query(query,[name,location]);
}

//4. Delete a scenario

async function deleteScenarioRepository(id){
    const query= `delete from public.scenario
                   where id=$1`;
    return pool.query(query,[id]);
}

// 5. Update an scenario
async function updateScenarioRepository(name, location, id){
    const query= `update public.scenario
                    set name= $1, location=$2 
                    where id= $3
                    RETURNING *`
    return pool.query(query, [name,location,id]);
}

module.exports = {getScenariosRepository, createScenarioRepository, checkScenarioRepository, 
    deleteScenarioRepository, updateScenarioRepository}