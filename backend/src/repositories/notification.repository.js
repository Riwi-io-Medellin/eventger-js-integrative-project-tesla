const pool= require('../db/sql.js')

// 1. FUnction to get all emails of active users
async function getEmails(){
    const query = `select * from public.user where is_active= true;`
    return pool.query(query);
}

// 2. FUnction to get all phone numbers of active users
async function getPhone(){
    const query = `select phone_number
                    from public.user
                    where is_active= true;`
    return pool.query(query);   
}

// 3. FUnction to get space, scenario, discipline and department name of an event
async function getNames(id){
    const query = `select e.title, s.name as scenario_name, spa.name as space_name, d.name as discipline_name, u.name as creator_name
                    from public.event e
                    inner join public.scenario s 
                    on e.scenario_id = s.id
                    inner join public.space spa
                    on e.space_id = spa.id 
                    inner join public.discipline d
                    on e.discipline_id = d.id 
                    inner join public.user u
                    on e.creator_id = u.id
                    where e.id = $1;`
    return pool.query(query, [id]);
}

// 4. Function to create a notification in database
async function createNotificationRepo(event, user){
    const query= `insert into public.notification(event_id, user_id) values ($1, $2) RETURNING *;`
    return pool.query(query,[event, user]);
}

// 5. Get all Notifications by user Id
async function getNotificationUser(user_id){
    const query= `select * 
            from public.notification 
            where user_id=$1
            order by created_at;`
    return pool.query(query,[user_id]);
}

// 6. Functions to mark a function read
async function readRepo(option, id){
    const query= `update public.notification
                    set is_read= $1
                    where id=$2
                    RETURNING *;`
    return pool.query(query,[option, id])
}

// 7. Count unread notifications by user
async function unreadRepo(user_id){
    const query= `select count(*) as read
                    from public.notification
                    where user_id=$1 and is_read = false;`
    return pool.query(query,[user_id]);
}

//8.  Get all users ID
async function users(){
    const query=`select id from public.user`
    return pool.query(query);
}

// 9. Get daily  notifications
async function dailyNotification(){
    const query=`select * from public.event
                where DATE(start_date) = CURRENT_DATE + INTERVAL '1 day';`
    return pool.query(query);
}


module.exports = {getEmails, getNames, getPhone, createNotificationRepo,
    getNotificationUser, readRepo, unreadRepo, users, dailyNotification}