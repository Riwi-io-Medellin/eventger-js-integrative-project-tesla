const express = require("express")
const app = express()

require("dotenv").config() // Dot-Env Use

//const handleError = require("./src/middlewares/handleError.middleware")

const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())

// Routes of App

const spaceRouter = require('./src/routes/space.route.js')

app.use("/space", spaceRouter)

// App initializing
app.listen(PORT, () => console.log(`The app is running on port ${PORT}`))

