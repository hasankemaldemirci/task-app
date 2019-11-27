const express = require("express")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

require("./db/mongoose")

const Task = require("./models/task")

app.post("/tasks", async (req, res) => {
  try {
    const task = await new Task(req.body).save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.listen(port, () => console.log(`App is listening on port ${port}!`))
