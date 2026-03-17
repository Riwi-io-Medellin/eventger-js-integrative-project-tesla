const {getEvents, getGoals, getCompletedEvents, getEventsAllDepartments,
    getGoalsAllDepartments, getEventsDiscipline, getGoalDiscipline}= require('../repositories/dashboard.repository.js');

async function generalMetricsService(year){
    // Get all goals of the year
    const goals = await getGoals(year)
    let totalGoals = goals.rows[0].total_goal

    const events = await getCompletedEvents(year)
    const totalEvents = events.rowCount

    let percentage=0
    if (totalGoals>0){
        percentage = (totalEvents/totalGoals)*100
    }

    const results = {"total_goal": Number(totalGoals),
                    "completed_events": totalEvents,
                    "pending_events": totalGoals-totalEvents,
                    "percentage_advance":percentage }
    return results;
}

async function generalMetrics2Service(year){
    const goals = await getGoalsAllDepartments(year)
    const goalsDep = goals.rows
    
    const events = await getEventsAllDepartments(year)
    const eventsDep = events.rows

    let result ={}
    

    for (let i=0; goalsDep.length>i; i++){
        const element = goalsDep[i]
        let evCompleted = 0

        for(let j=0; eventsDep.length>j; j++){

            if (element.name === eventsDep[j].name){
                evCompleted= eventsDep[j].events_per_department
            }
        }

        result[element.name] = {
            "name": element.name,
            "department_goals": Number(element.goals_per_department),
            "events_completed": Number(evCompleted)
        }
    }
    return result;
}

async function filter(year){
    const goals = await getGoalDiscipline(year)
    const goalsDep = goals.rows
    
    const events = await getEventsDiscipline(year)
    const eventsDep = events.rows
    

    let result ={}
    

    for (let i=0; goalsDep.length>i; i++){
        const element = goalsDep[i]
        let discipline = {}

        let evCompleted = 0
        let evPending = 0
        let percentage = 0

        for(let j=0; eventsDep.length>j; j++){
            const element2 = eventsDep[j]

            if (element.department_name === element2.department_name && element.discipline_name === element2.discipline_name){
                evCompleted= element2.events_per_discipline
                evPending = element.goals_per_discipline- evCompleted
                percentage = (evCompleted/element.goals_per_discipline)*100
            }
        }
        
        if (!result[element.department_name]) {
            result[element.department_name] = []
        }

        result[element.department_name].push({
            "discipline_name": element.discipline_name,
            "goals_per_discipline": Number(element.goals_per_discipline),
            "evenst_completed": Number(evCompleted),
            "pending_events": Number(evPending),
            "percentage": percentage
        })
    }
    return result;
}


module.exports = {generalMetricsService, generalMetrics2Service, filter}