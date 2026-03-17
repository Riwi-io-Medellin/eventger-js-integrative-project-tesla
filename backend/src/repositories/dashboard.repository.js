const pool= require('../db/sql.js')

// 1. Function to get all events per year
async function getEvents(year){
    const query= `select * from public.event
                    where EXTRACT(YEAR FROM start_date) = $1; `
    return pool.query(query, [year]);
}

// 2. Function to get all completed events of the year
async function getCompletedEvents(year){
    const query= `select * from public.event
                    where finish_date< current_timestamp and EXTRACT(YEAR FROM start_date) =$1;`
    return pool.query(query,[year]);
}

// 3. FUnction to get all goals of the year
async function getGoals(year){
    const query= `select sum(amount) as total_goal from public.goal where year=$1`
    return pool.query(query, [year]);
}

// 4. Function to get all events completed per department and year
async function getEventsAllDepartments(year){
    const query= `select u.department_id, count(e.id) as events_per_department,  d.name 
                    from public.event e 
                    inner join public.user u 
                    on e.creator_id = u.id
                    inner join public.department d 
                    on d.id = u.department_id 
                    where e.finish_date < current_timestamp and EXTRACT(YEAR FROM e.finish_date) =$1
                    group by u.department_id, d.name;`
    return pool.query(query, [year]);
}

//5. Function to get all goals per department and year
async function getGoalsAllDepartments(year){
    const query = `select g.department_id, sum(g.amount) as goals_per_department, d.name
                    from public.goal g
                    inner join public.department d
                    on g.department_id= d.id 
                    group by department_id, d.name, g.year
                    having g.year= $1;`
    return pool.query(query, [year]);
}

// 5. Function to get events per discipline and year
async function getEventsDiscipline(year){
    const query = `select d.name as department_name, di.name as discipline_name, count(e.id) as events_per_discipline
                    from public.event e
                    inner join public.user u 
                    on e.creator_id = u.id
                    inner join public.department d 
                    on d.id = u.department_id
                    inner join public.discipline di 
                    on di.id = e.discipline_id
                    where EXTRACT(YEAR FROM e.finish_date) = $1
                    group by d.name, di.name;`
    return pool.query(query, [year])
}

// 5. Function to get goals per discipline and year
async function getGoalDiscipline(year){
    const query = `select di.name as discipline_name, d.name as department_name, sum(g.amount) as goals_per_discipline
                    from public.goal g
                    inner join public.department d
                    on g.department_id= d.id
                    inner join public.discipline di
                    on di.id = g.discipline_id 
                    group by department_id, d.name, g.year, di.name, d.name
                    having g.year= $1;`
    return pool.query(query, [year])
}

module.exports={getEvents, getGoals, getCompletedEvents, getGoalsAllDepartments, 
    getEventsAllDepartments, getEventsDiscipline, getGoalDiscipline}