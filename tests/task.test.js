const request = require('supertest')
const app = require('../src/app')

const Task = require('../src/models/task')

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
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task correct object'
      })
      .expect(res => {
        const actual = res.body.description
        expect(actual).toEqual('Test task correct object')
      })
  })

  test('Should return validation error message with empty description', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: ''
      })
      .expect(res => {
        const actual = res.body.message
        const expected = 'Task validation failed: description: Path `description` is required.'
        expect(actual).toEqual(expected)
      })
  })
})