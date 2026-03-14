const pool= require('../db/sql.js')

// 1. Function to get all events per year
async function getEvents(year){
    const query = `SELECT *
                    FROM public.event
                    WHERE EXTRACT(YEAR FROM start_date) = $1; `
    return pool.query(query, [year]);
}

// 2. FUnction to get all completed events of the year
async function getCompletedEvents(year){
    const query = `SELECT *
                    FROM public.event
                    WHERE finish_date< current_timestamp and EXTRACT(YEAR FROM start_date) =$1;`
    return pool.query(query,[year]);
}


// 3. FUnction to get all goals
async function getGoals(year){
    const query = `select * from public.goal where year=$1`
    return pool.query(query, [year]);
}


// 4. Function to get all events per department
async function getEventsAllDepartments(year){
    const query = `select u.department_id, count(e.id) as events_per_department,  d.name, e.finish_date 
                from "event" e 
                inner join "user" u 
                on e.creator_id = u.id
                inner join department d 
                on d.id = u.department_id 
                group by u.department_id, d.name, e.finish_date
                having eXTRACT(YEAR FROM e.finish_date) =$1;`
    return pool.query(query, [year])
}

async function getGoalsAllDepartments(year){
    const query = `select g.department_id, sum(g.amount) as goals_per_department, d.name, g.year
                    from public.goal g
                    inner join department d
                    on g.department_id= d.id 
                    group by department_id, d.name, g.year
                    having g.year= $1;`
    return pool.query(query, [year])
}

module.exports={getEvents, getGoals, getCompletedEvents, getGoalsAllDepartments, 
    getEventsAllDepartments}