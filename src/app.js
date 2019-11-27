const express = require('express')

require('./db/mongoose')

const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use('/tasks', taskRouter)

app.listen(port, () => console.log(`App is listening on port ${port}!`))