const Task = require('../../src/models/task')

const setupDatabase = async () => {
  await Task.deleteMany({})
}

module.exports = setupDatabase