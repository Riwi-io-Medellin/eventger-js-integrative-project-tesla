const express = require("express")
const app = express()

require("dotenv").config() // Dot-Env Use

const cron = require('node-cron')
const {reminderService, reminderPhoneService} = require('./src/services/notification.service.js')

const morgan = require('morgan')
const handleError = require("./src/middlewares/handleError.middleware")

const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(morgan("dev"))

// Routes of App

// JERO GALLEGO ROUTES

// Auth Module
const authRouter = require('./src/routes/auth.route')

app.use("/auth", authRouter)

// Users CRUD Module
const userRouter = require('./src/routes/user.route')

app.use("/user", userRouter)

// Events Module
const eventModule = require("./src/routes/event.route")

app.use("/event", eventModule)

// AI Module
const aiModule = require("./src/routes/ai.route")

app.use("/ai", aiModule)

// SARA S ROUTES

// Spaces Router
const spaceRouter = require('./src/routes/space.route.js')
app.use("/space", spaceRouter)

// Scenario Router
const scenarioRouter = require('./src/routes/scenario.route.js')
app.use("/scenario", scenarioRouter)

// Profile Router
const profileRouter= require('./src/routes/profile.route.js')
app.use("/profile", profileRouter)

// Dashboard Router
const dashboardRouter= require('./src/routes/dashboard.route.js')
app.use("/dashboard", dashboardRouter)

// Notification USer
const notificationRouter= require('./src/routes/notification.route.js')
app.use("/notification", notificationRouter)

// Error handling middleware
app.use(handleError)
 
// Daily reminders at 10:00 am for events of next day
cron.schedule('0 10 * * *', async () => {
    try { 
        await reminderService()
        await reminderPhoneService()
        console.log("Reminder Send →")
    } catch (err) {
        console.error(err)
    }
})

// App initializing
app.listen(PORT, () => console.log(`The app is running on port ${PORT}`))