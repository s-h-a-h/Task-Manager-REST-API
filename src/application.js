require('dotenv').config()
const express = require('express')
require('./db/databaseMongoose')
const userRoutes = require('./routers/userRoutes')
const taskRoutes = require('./routers/taskRoutes')

const app = express()

app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)

module.exports = app