const {getEvents, getGoals, getCompletedEvents, getEventsAllDepartments,
    getGoalsAllDepartments}= require('../repositories/dashboard.repository.js');

// 1. General metrics

async function genMetricsService(year){
    const goals= await getGoals(year)
    const totalEventsGoal = goals.rowCount
    
    const events = await getCompletedEvents(year)
    const totalEventsCompleted =  events.rowCount

    const pendingEvents = totalEventsGoal-totalEventsCompleted
    let percentageCompleted; 
    
    if (totalEventsGoal!=0){
        percentageCompleted= (totalEventsCompleted/ totalEventsGoal)*100
    }

    const response = {"total_events_goal": totalEventsGoal,
        "total_events_completed": totalEventsCompleted,
        "pending_events": pendingEvents,
        "percentage_of_events_completed": percentageCompleted
    }

    return response;
}

async function genMetricsDepartment(year){
    const goalsDep= await getGoalsAllDepartments(year)
    const eventsDep= await getEventsAllDepartments(year)
    console.log(goalsDep.rows)
    console.log(eventsDep.rows)

    let response = {}

    for (let i=0; goalsDep.rowCount>0; i++){
        let department = goalsDep.rows[i].name
        let goalsPerDep= goalsDep.rows[i].goals_per_department
        let eventsComp = 0
        
        for (let j=0; eventsDep.rowCount>0; j++){
            if (goalsDep.rows[i].department_id === eventsDep.rows[j].department_id){
                eventsComp =eventsDep.rows[j].events_per_department
            }}
        response.department ={"department": department, "goal": goalsPerDep, "events_completed": eventsComp}
        
    }
    return response;      
}



module.exports = {genMetricsService, genMetricsDepartment}