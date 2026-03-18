const {getGoals, getCompletedEvents, getEventsAllDepartments,
    getGoalsAllDepartments, getEventsDiscipline, getGoalDiscipline}= require('../repositories/dashboard.repository.js');

// 1. Function to get all general metrics of year

async function generalMetricsService(year){
    // Get all goals of the year
    const goals = await getGoals(year)
    let totalGoals = goals.rows[0].total_goal

    // Get completed events of the year
    const events = await getCompletedEvents(year)
    const totalEvents = events.rowCount

    // Percentage of completion of all events
    let percentage=0
    if (totalGoals>0){
        percentage = (totalEvents/totalGoals)*100
    }

    // Objecto to save the metrics information
    const results = {"total_goal": Number(totalGoals),
                    "completed_events": totalEvents,
                    "pending_events": totalGoals-totalEvents,
                    "percentage_advance":percentage }
    return results;
}

//2. Function to get all general metrics of the year filtered by department and discipline

async function generalMetrics2Service(year){
    // Get all goals of all departments
    const goals = await getGoalsAllDepartments(year)
    const goalsDep = goals.rows
    
    // Get all goals of all completed events per department
    const events = await getEventsAllDepartments(year)
    const eventsDep = events.rows

    let result ={}

    // Loop for, to create an object for each deparment that contains the goal, completed events and deparment name
    for (let i=0; goalsDep.length>i; i++){
        const element = goalsDep[i]
        let evCompleted = 0

        for(let j=0; eventsDep.length>j; j++){

            if (element.name === eventsDep[j].name){
                evCompleted= eventsDep[j].events_per_department
            }
        }

        // Creation of object by element of the array
        result[element.name] = {
            "name": element.name,
            "department_goals": Number(element.goals_per_department),
            "events_completed": Number(evCompleted),
            "events_pendign":Number(element.goals_per_department)-Number(evCompleted)
        }
    }
    return result;
}


// 3. Function to get all metrics of every department and discipline per year

async function filter(year){
    // get all goals for each discipline filtered by department
    const goals = await getGoalDiscipline(year)
    const goalsDep = goals.rows
    
    // get all completed events of the year for each discipline filtered by department
    const events = await getEventsDiscipline(year)
    const eventsDep = events.rows
    
    // Variable to storage all results per department
    let result ={}
    
    // Loop for, to create an array for each department, that contains each discipline with goals, completed events, percentage of advance, and pending events
    for (let i=0; goalsDep.length>i; i++){
        const element = goalsDep[i]

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

        //Creation of each department and its disciplines with metrics
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