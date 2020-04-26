const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Task = require('../../src/models/task')
const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  age: 0,
  name: 'User one',
  email: 'userone@example.com',
  password: 'userone123456',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  completed: false,
  description: 'Seed task one'
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  completed: true,
  description: 'Seed task two'
}

const validObjectId = new mongoose.Types.ObjectId();

const setupDatabase = async () => {
  await Task.deleteMany({})
  await User.deleteMany({})

  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new User(userOne).save()
}

const disconnectFromDatabase = async () => {
  await mongoose.disconnect()
}

module.exports = {
  userOneId,
  userOne,
  taskOne,
  taskTwo,
  validObjectId,
  setupDatabase,
  disconnectFromDatabase
}