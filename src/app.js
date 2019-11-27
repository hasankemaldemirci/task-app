const express = require("express")
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

require("./db/mongoose")

// Routers
const tasks = require("./routers/tasks")

app.use("/tasks", tasks)

app.listen(port, () => console.log(`App is listening on port ${port}!`))
