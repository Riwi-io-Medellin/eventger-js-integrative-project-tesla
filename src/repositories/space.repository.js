const pool = require('../db/sql.js');

// 1. Function to Show all spaces
async function getSpacesRepository(){
    const query= `select  s.name, s.description, s.status, sc.name as scenario_name
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id`
    return pool.query(query);
} 

// 2. Check if the space already exists in a scenario

async function checkSpaceRepository(name, scenario_id){
    const checkQuery= `select * 
                        from public.space 
                        where name=$1 and scenario_id=$2`;
    return pool.query(checkQuery,[name, scenario_id])
}

//3. Create a new space

async function createSpaceRepository(name, description, scenario_id){
    const query= `insert into public.space (name, description, scenario_id)
                    values ($1, $2, $3)
                    RETURNING *`
    return pool.query(query,[name,description,scenario_id]);
}

//4. Delete a space

async function deleteSpaceRepository(id){
    const query= `delete from public.space
                   where id=$1`;
    return pool.query(query,[id]);
}

// 5. Update an space
async function updateSpaceRepository(name, description, scenario_id,id){
    const query= `UPDATE public.space 
                    SET name= $1, description=$2, scenario_id =$3  
                    WHERE id= $4
                    RETURNING *`
    return pool.query(query, [name,description,scenario_id,id]);
}

// 6. update status of an space
async function updateSpaceStatusRepository(id,status){
    const query = `UPDATE public.space
                   SET status=$1
                   WHERE id=$2
                   RETURNING *`;
    return pool.query(query,[status,id]);
}

module.exports = {getSpacesRepository,checkSpaceRepository, createSpaceRepository,
    deleteSpaceRepository, updateSpaceRepository, updateSpaceStatusRepository}
