const request = require('supertest')

const app = require('../src/app')

const Task = require('../src/models/task')

const { setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('POST /tasks', () => {
  test('Should return 201 with valid request', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Valid task one'
      })
      .expect(201)
  })
  
  test('Should return correct object in response', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Valid task two',
        completed: true
      })
      
      const expected = {
        description: 'Valid task two',
        completed: true
      }

      expect(response.body).toMatchObject(expected)
  })

  test('Should return 400 with empty request', async () => {
    await request(app)
      .post('/tasks')
      .send()
      .expect(400)
  })

  test('Should return 400 with empty object', async () => {
    await request(app)
      .post('/tasks')
      .send({})
      .expect(400)
  })

  test('Should return 400 with empty description', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: ''
      })
      .expect(400)
  })

  test('Should save task when completed set to false', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Valid task three',
        completed: false
      })

      const task = await Task.findOne({ description: 'Valid task three' })

      expect(task.completed).toEqual(false)
  })

  test('Should return specific error message in response with empty description', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: ''
      })

      const expected = 'Task validation failed: description: Path `description` is required.'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return specific error message in response with empty object', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({})

      const expected = 'Task validation failed: description: Path `description` is required.'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return specific error message in response with empty request', async () => {
    const response = await request(app)
      .post('/tasks')
      .send()

      const expected = 'Task validation failed: description: Path `description` is required.'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return specific error message in response if completed is empty string', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Valid task four',
        completed: ''
      })
      
      const expected = 'Task validation failed: completed: Cast to Boolean failed for value \"\" at path \"completed\"'

      expect(response.body.message).toEqual(expected)
  })
})