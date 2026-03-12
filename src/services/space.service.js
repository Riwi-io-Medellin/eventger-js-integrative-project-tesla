const pool = require('../db/sql.js');


// 1. Function to Show all spaces OK
async function getSpacesService() {
    const query = `select  s.name, s.description, s.status, sc.name as scenario_name
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id`
    const response= await pool.query(query)
    return response.rows;
} 

// 2. Function to create a new space OK
async function createSpaceService(name, description, scenario_id) {
    const checkQuery= `SELECT * 
                        FROM public.space 
                        WHERE name=$1 and scenario_id=$2`;
    const check = await pool.query(checkQuery, [name, scenario_id])

    const query =`insert into public.space (name, description, scenario_id)
                    values ($1, $2, $3)
                    RETURNING *`

    if (check.rowCount===0){
        const response = await pool.query(query,[name, description,scenario_id])
        return response.rows[0];
    } else{
        const message = 'This space already exists in the scenario'
        return message;
    }
}


// 3. Function to delete a space OK
async function deleteSpaceService(id){
    const query = `DELETE FROM public.space 
                    WHERE id=$1`
    const response = await pool.query(query, [id]);
    return response;
}

// 4. Function to update an space
async function updateSpaceService(name, description, scenario_id,id){
    const checkQuery= `SELECT * 
                        FROM public.space 
                        WHERE name=$1 and scenario_id=$2`;
    const check = await pool.query(checkQuery, [name, scenario_id])

    const query = `UPDATE public.space 
                    SET name= $1, description=$2, scenario_id =$3  
                    WHERE id= $4
                    RETURNING *`

    if (check.rowCount===0){
        const response = await pool.query(query,[name, description,scenario_id,id])
        return response.rows[0];
    } else{
        const message = 'That space name already exists for that scenario'
        return message;}
}

// 5. Function to update status
async function updateSpaceStatusService(id, status){
    const query =`UPDATE public.space
                    SET status = $1
                    WHERE id = $2
                    RETURNING *`

    const response= await pool.query(query, [status, id]);
    return response.rows[0];
}

module.exports = {getSpacesService,
                createSpaceService,
                deleteSpaceService,
                updateSpaceService,
                updateSpaceStatusService,
};
