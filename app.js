const express = require("express")
const app = express()

require("dotenv").config() // Dot-Env Use

const morgan = require('morgan')
const handleError = require("./src/middlewares/handleError.middleware")

const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(morgan("dev"))

// Routes of App

const authRouter = require('./src/routes/auth.route')

app.use("/auth", authRouter)

// Error handling middleware
app.use(handleError)

// App initializing
app.listen(PORT, () => console.log(`The app is running on port ${PORT}`))