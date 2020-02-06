const mongoose = require('mongoose')

const Task = require('../../src/models/task')
const User = require('../../src/models/user')

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
}

module.exports = {
  taskOne,
  taskTwo,
  validObjectId,
  setupDatabase
}