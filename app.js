const express = require("express")
const app = express()

require("dotenv").config() // Dot-Env Use
const morgan = require('morgan')

const handleError = require("./src/middlewares/handleError.middleware")
const routeValidation = require("./src/middlewares/routeValidation.middleware")

const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(morgan("dev"))

// Routes of App

// Auth Module
const authRouter = require('./src/routes/auth.route')

app.use("/auth", authRouter)

// Users CRUD Module
const userRouter = require('./src/routes/user.route')

app.use("/user", userRouter)

// Error handling middleware
app.use(handleError)

// App initializing
app.listen(PORT, () => console.log(`The app is running on port ${PORT}`))