// Auth business logic

// How works a login flow in API Modern constructions
/*
    1. User sends email and password to server
    2. Server checks the data
    3.  Server generates a firmed token JWT
    4. Server sends token to client
    5. Client save's the token (localstorage/cookies)
    6. Each request to protected routes must have the token in the headers
    7. The server checks the token with the assign.
*/

