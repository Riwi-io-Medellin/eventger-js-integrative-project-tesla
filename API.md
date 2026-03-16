# API Documentation - Eventger JS

Guide with all the endpoints and his neededs for use it. This documentation was made exclusively for the developers team of Eventger JS

## Token in Headers

For each protected route, you must send a token with the purpose that the server can check who are the client that is sending the request. This token is returned in the moment that a user logs into the application. You must save it and send it in the headers of each request that you make to the server. It's your identification.

## Endpoints

The endpoints are structured and divided by entities. User has different endpoints, event has another endpoints. Here you will find all the endpoints with his purpose and requeriments.

Endpoints existing for the client:
- Auth
- User
- Event
- Space
- Scenario

---

### Auth

The auth entity was made for register, login and resetting password

There aren't any protection in the routes.

#### Register

``` POST /auth/register ```

Used for register any user. Need the next data inside the body as JSON:

```
{
    name: String,
    email: String,
    phone: String,
    password: String,
    departmentId: String
}
```

The role will be set default as visualizer. Must be the admin gen who change it, as the isActive state.

#### Login

``` POST /auth/login ```

Used for log users. Parameters needed:

```
{
    email: String,
    password: String
}
```

For log in, the account must have been active by the admin.

#### Request Reset Password 

``` POST /auth/reset-request ```

Must send:

```
{
    email: String
}
```

This will send a link to the email of the user with a special token for authing that request. This link will be useful for resetting the password

#### Resetting Password

``` POST /auth/reset-password ```

Must send:

```
{
    token: String,
    newPassword: String
}
```

The token must be the same that has been sent in the URL resetting the password

---

### User

Here you will find all the endpoints for make requests about users data

You will find the roles allowed for each request below the info

#### Getting user info

``` GET /user ```

This endpoint will return the data with the filters that you put in the queries. For example:

```GET /user?isActive=false&roleName=visualizer```: It will return all the users that aren't active and that it's role is visualizer. It works as a WHERE declarement.

The query filters available are:
```
- isActive=Boolean
- departmentId=String
- roleName=String
```

If you make the request without any query, it will return all users without any restriction

All endpoints return only 50 users per request.

Roles allowed: ```admin_gen```

#### Getting users by sheet

``` GET /user/sheet ```

This endpoint will return a list of users with the specifications that you request. For example:

```GET /user/sheet?page=1&limit=10```: This will return the first 10 users, with ```page=2``` will return the next 10 users.

Roles allowed: ```admin_gen```

#### Getting user by ID

``` GET /user/ID ```

This endpoint return all data of a specific user, remember that the ID it's in format UUID.

If the user isn't found, it will return 404 error

Roles allowed: ```admin_gen, admin_spa, event_creator, visualizer```

#### Creating user

``` POST /user ```

For the admin users CRUD, this is another endpoint for creating an user. Unlike the register endpoint, in this you will can set isActive and roleId inside this same request.

Required fields in the body:
```
{
    name:  String,
    email: String,
    password: String,
    departmentId: String,
    phone: String,
    roleName: String
}
```

The ```isActive``` parameter will be turned as true by default, because it's the admin who is creating it

Roles allowed: ```admin_gen```

#### Update all user info

``` PUT /user/ID ```

This endpoint will be used for handle put requests

Needed fields are:
```
{
    name: String,
    email: String,
    departmentId: String,
    roleName: String,
    phone: String,
    isActive: Boolean
}
```

Roles allowed: ```admin_gen```

#### Update partial info of a user

``` PATCH /user/:id ```

This endpoint is used for update any attribute of the user. The dates must be in the query of the url, and it will update only the params that you send

For example:
``` PATCH /user/SOME_ID?name=Jeronimo&roleName=admin_gen ```

The available queries are:
- name
- email
- isActive
- phone
- departmentId
- roleName

If the ID doesn't exists, it will return error. If there aren't any queries, it will return error.

Roles allowed: ```admin_gen```

#### Deleting user

``` DELETE /user/:id ```

This endpoint is used for delete any user. It will return error if the user ID doesn't exists, and if it's deleted will return all the user info.

Roles allowed: ```admin_gen```

---

### Event

Used for all the events data

Take care manipulating the events data, because there are some validations that the server will make, like checking the dates, checking that a specific date isn't bussy, etc...

This route is allowed for all roles excepting some special routes.

#### Getting events

``` GET /event ```

It works like users get endpoint. You can filter the data by certain dates, for example:

```GET /event?isActive&disciplineId=SOME_ID ```: It will return all events that are active of any discipline.

Available queries are:
- isActive: String,
- scenarioId: String,
- spaceId: String
- disciplineId: String
- creatorId: String

If there isn't any query, it will return the 15 earliest events

#### Getting events by a lapse

``` GET /event/by-lapse?startDate=DATE&finishDate=DATE ```

It's helpful for know what events are in any lapse

#### Getting by id

``` GET /event/ID ```

Will return all the event data of a specific event.

#### Create event

``` POST /event ```

Useful for creating new events. Required fields are:

```
{
    title: String,
    description: String,
    startDate: String,
    finishDate: String,
    isActive: Boolean,
    disciplineId: String,
    scenarioId: String,
    spaceId: String,
    creatorId: String
}   
```

Roles allowed: ```admin_spa, event_creator```

#### Updating all event data

``` PUT /event/ID ```

Useful for update all the data of an event. Requried fields are:

```
{
    title: String,
    description: String,
    startDate: String,
    finishDate: String,
    isActive: Boolean,
    disciplineId: String,
    scenarioId: String,
    spaceId: String,
    creatorId: String
}   
```

Roles allowed: ```admin_spa, event_creator```

#### Updating partial data

``` PATCH /event/ID ```

Useful for update just some attributes, that are specified in the queries of the url. For example:

``` PATCH/event/SOME_ID?title=Piscina Deportiva&creatorId=SOME_ID ```: This will update the title and the creator id of the event.

Available queries:
- title: String
- description: String
- startDate: String
- finishDate: String
- isActive: Boolean
- disciplineId: String
- scenarioId: String
- spaceId: String
- creatorId: String

Roles allowed: ```admin_spa, event_creator```

#### Deleting

``` DELETE /event/ID ```

Useful for deleting events. If the event id doesn't exists, it will return error.

Roles allowed: ```admin_spa, event_creator```

---

### AI

Requests for simple messages that need artificial intelligence

#### Ask anything to AI

``` POST /ai/ask ```

Must be in the body:

- prompt: String

The AI will only answer questions about deport, health and welfare