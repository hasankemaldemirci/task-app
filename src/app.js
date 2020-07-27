require('../config/env.config')
const express = require('express')

require('./db/mongoose')

const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express()

app.use(express.json())
app.use('/tasks', taskRouter)
app.use('/users', userRouter)

module.exports = app