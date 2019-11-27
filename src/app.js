const express = require("express")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

require("./db/mongoose")

const Task = require("./models/task")

app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch (err) {
    res.status(500)
  }
})

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    res.status(200).send(task)
  } catch (err) {
    res.status(500)
  }
})

app.listen(port, () => console.log(`App is listening on port ${port}!`))
