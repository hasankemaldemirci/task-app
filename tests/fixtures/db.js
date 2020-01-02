const mongoose = require('mongoose')

const Task = require('../../src/models/task')

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  completed: false,
  description: 'Seed task one'
}

const validObjectId = new mongoose.Types.ObjectId();

const setupDatabase = async () => {
  await Task.deleteMany({})
  await new Task(taskOne).save()
}

module.exports = {
  taskOne,
  validObjectId,
  setupDatabase
}