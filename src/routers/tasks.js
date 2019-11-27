const express = require("express")
const router = express.Router()

const Task = require("../models/task")

router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch (err) {
    res.status(500)
  }
})

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    res.status(200).send(task)
  } catch (err) {
    res.status(500)
  }
})

module.exports = router
