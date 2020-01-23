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

router.get('/', async (_req, res) => {
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

    if (!task) {
      return res.status(404).send()
    }

    res.status(200).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (_err) {
    res.status(500).send()
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const requestedUpdateKeys = Object.keys(req.body)
    const validUpdateKeys = ['description', 'completed']
    const isValidUpdate = 
      requestedUpdateKeys.every(key => validUpdateKeys.includes(key)) &&
      Object.entries(req.body).length
  
    if (!isValidUpdate) {
      return res.status(400).send({ error: 'Invalid updates!' })
    }
  
    const task = await Task.findById(req.params.id)
  
    if (!task) {
      return res.status(404).send()
    }
  
    requestedUpdateKeys.forEach(key => task[key] = req.body[key])
  
    await task.save()
    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
