const express = require('express')

const Task = require('../models/task')

const router = new express.Router()

router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch (err) {
    res.status(500).send()
  }
})

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    res.status(200).send(task)
  } catch (err) {
    res.status(500).send()    
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).send()
    }

    res.status(200).send(task)    
  } catch (err) {
    res.status(404).send()
  }
})

module.exports = router


