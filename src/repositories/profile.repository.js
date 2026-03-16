const pool = require('../db/sql.js');

// 1. Function get all events created by one user
async function getEventsByUserRepo(id){
    const query= `select e.title, e.description, e.start_date, e.finish_date, d.name as discipline_name, sce.name as scenario_name, s.name as space_name, u.name as creator_name
                from public.event e 
                inner join public.discipline d 
                on d.id = e.discipline_id
                inner join public.scenario sce
                on e.scenario_id = sce.id
                inner join public.space s
                on e.space_id = s.id
                inner join public.user u
                on e.creator_id= u.id
                where e.creator_id=$1;`
    return pool.query(query,[id]);
} 

module.exports = {getEventsByUserRepo}