const request = require('supertest')
const app = require('../src/app')

const Task = require('../src/models/task')

const setupDatabase = require('./fixtures/db')

beforeEach(() => {
  setupDatabase()
})

describe('POST /tasks', () => {
  test('Should return 201 with valid request', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Valid test task 201'
      })
      .expect(201)
  })
  
  test('Should set completed to false in database if not sent in request', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Valid test task completed'
      })

      const task = await Task.findOne({ description: 'Valid test task completed' })
      expect(task.completed).toEqual(false)
  })

  test('Should return correct object in response', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Test task correct object'
      })

      const expected = {
        description: 'Test task correct object',
        completed: false
      }

      expect(response.body).toMatchObject(expected)
  })

  test('Should return validation error message with empty description', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: ''
      })

      const actualMessage = response.body.message
      const expectedMessage = 'Task validation failed: description: Path `description` is required.'

      expect(actualMessage).toEqual(expectedMessage)
  })
})