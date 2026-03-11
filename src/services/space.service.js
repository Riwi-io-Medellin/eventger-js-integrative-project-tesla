const pool = require('../db/sql.js');


// 1. Function to Show all spaces
async function getSpacesService() {
    const query = `select  s.name, s.description, s.status, sc.name as scenario_name
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id`
    const {rows} = await pool.query(query)
    return rows;
} 

// 2. Function to filter by name (search bar)
async function getSpaceByNameService(name) {
    const query = `select  s.name, s.description, s.status, sc.name as scenario
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id
                    where s.name ilike $1`
    const {rows} = await pool.query(query, [`%${name}%`]);
    return rows
}

// 3. Function to filter by status
async function getSpaceByStatusService(status) {
    const query = `select  s.name, s.description, s.status, sc.name as scenario
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id
                    where s.status = $1`
    const {rows} = await pool.query(query, [status]);
    return rows
}

// 4. Function to create a new space
async function createSpaceService(name, description, scenario_id) {
    const query =`insert into public.space (name, description, scenario_id)
                    values ($1, $2, $3)
                    RETURNING *`
    const {rows} = await pool.query(query,[name, description,scenario_id])
    return rows[0]
}

// 5. Function to delete a space
async function deleteSpaceService(id){
    const query = `DELETE FROM public.space 
                    WHERE id=$1
                    RETURNING *`
    const {rows} = await pool.query(query, [id]);
    return rows[0] || null
}

// 6. Function to update an space
async function updateSpaceService(name, description, scenario_id,id){
    const query = `UPDATE public.space 
                    SET name= $1, description=$2 scenario_id =$3  
                    WHERE id= $4
                    RETURNING *`
    
    const response = await pool.query(query, [name, description,scenario_id,id]);
    response.rows[0]
}

// 7. FUnction to update status
async function updateSpaceStatusService(id, status){
    const query =`UPDATE public.space
                    SET status = $1
                    WHERE id = $2
                    RETURNING *`

    const { rows } = await pool.query(query, [status, id])
    return rows[0]
}

// 8. Function to count all spaces 
async function countAllSpacesService(){
    const query =`SELECT count(id) as total FROM public.space`
    const {rows} = await pool.query(query)
    return number(rows[0].total)
}
// 9. Function to count active spaces

async function countAllActiveSpacesService(){
    const query =`SELECT count(id) as total FROM public.space WHERE status= 'active'`
    const {rows} = await pool.query(query)
    return Number(rows[0].total)
}

module.exports = {getSpacesService,
                getSpaceByNameService,
                getSpaceByStatusService,
                createSpaceService,
                deleteSpaceService,
                updateSpaceService,
                updateSpaceStatusService,
                countAllSpacesService,
                countAllActiveSpacesService
};
