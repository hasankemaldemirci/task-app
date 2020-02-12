const express = require('express')

const User = require('../models/user')

const router = new express.Router()

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch(err) {
    res.send(err)
  }
})

module.exports = router