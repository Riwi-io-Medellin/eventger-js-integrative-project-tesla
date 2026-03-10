import {pool} from '../db/sql.js'


// 1. Function to Show all spaces
export async function getSpaces() {
    const query = `select  s.name, s.description, s.status, sc.name 
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id`
    const {rows} = await pool.query(query)
    return rows;
}

// 2. Function to filter by name (search bar)
export async function getSpaceByName(name) {
    const query = `select  s.name, s.description, s.status, sc.name as scenario
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id
                    where s.name ilike $1`
    const {rows} = await pool.query(query, [`%${name}%`]);
    return rows
}

// 3. Function to filter by status
export async function getSpaceByStatus(status) {
    const query = `select  s.name, s.description, s.status, sc.name as scenario
                    from public.space s 
                    inner join public.scenario sc 
                    on sc.id = s.scenario_id
                    where s.status = $1`
    const {rows} = await pool.query(query, [status]);
    return rows
}

// 4. Function to create a new space
export async function createSpace(name, description, scenario) {
    const query =`insert into public.space (name, description, scenario_id)
                    values ($1, $2,(select sc.id from scenario sc where sc.name = $3 ))
                    RETURNING *`
    const {rows} = await pool.query(query,[name, description,scenario])
    return rows[0]
}

// 5. Function to delete a space
export async function deleteSpace (id){
    const query = `DELETE FROM public.space 
                    WHERE id=$1
                    RETURNING *`
    const {rows} = await pool.query(query, [id]);
    return rows[0] || null
}

// 6. Function to update an space
export async function updateSpace(name, description, scenario_name,id){
    const query = `UPDATE public.space 
                    SET name= $1, description=$2 scenario_id =(select sc.id from scenario sc where sc.name = $3 )  
                    WHERE id= $4
                    RETURNING *`
    
    const response = await pool.query(query, [name, description,scenario_name,id]);
    response.rows[0]
}

// 7. FUnction to update status
export async function updateSpaceStatus(id, status){
    const query =`UPDATE public.space
                    SET status = $1
                    WHERE id = $2
                    RETURNING *`

    const { rows } = await pool.query(query, [status, id])
    return rows[0]
}


