const express = require('express')

const User = require('../models/user')

const router = new express.Router()

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch(err) {
    res.status(400).send(err)
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

module.exports = router