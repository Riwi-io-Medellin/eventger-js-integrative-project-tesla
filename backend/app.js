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

const spaceRouter = require('./src/routes/space.route.js')
const scenarioRouter = require('./src/routes/scenario.route.js')
const profileRouter= require('./src/routes/profile.route.js')
const dashboardRouter= require('./src/routes/dashboard.route.js')
const notificationRouter= require('./src/routes/notification.route.js')

app.use("/space", spaceRouter)
app.use("/scenario", scenarioRouter)
app.use("/profile", profileRouter)
app.use("/dashboard", dashboardRouter)
app.use("/notification", notificationRouter)

// Error handling middleware
app.use(handleError)
 
// Daily reminders at 8:00 am
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