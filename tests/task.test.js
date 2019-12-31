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
        description: 'Test task description'
      })
      .expect(201)
  })
  
  test('Should return correct object in response', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: true
      })
      
      const expected = {
        description: 'Test task description',
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
        description: 'Test task description',
        completed: false
      })

      const task = await Task.findOne({ description: 'Test task description' })

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
        description: 'Test task description',
        completed: ''
      })
      
      const expected = 'Task validation failed: completed: Cast to Boolean failed for value \"\" at path \"completed\"'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return 201 when completed set to 1', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: 1
      })
      .expect(201)
  })

  test('Should return 201 when completed set to 0', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: 0
      })
      .expect(201)
  })

  test('Should save task with completed true when completed set to 1', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: 1
      })

      const task = await Task.findOne({ description: 'Test task description' })

      expect(task.completed).toEqual(true)
  })

  test('Should save task with completed false when completed set to 0', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: 0
      })

      const task = await Task.findOne({ description: 'Test task description' })

      expect(task.completed).toEqual(false)
  })

  test('Should return 400 if description is array', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: ['string', 'string']
      })
      .expect(400)
  })

  test('Should return 400 if description is object', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: {key: 'value'}
      })
      .expect(400)
  })

  test('Should return specific error message in response if description is array', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: ['string', 'string']
      })

      const expected = `Task validation failed: description: Cast to String failed for value \"[ 'string', 'string' ]\" at path \"description\"`

      expect(response.body.message).toEqual(expected)
  })

  test('Should return specific error message in response if description is object', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: {key: 'value'}
      })

      const expected = `Task validation failed: description: Cast to String failed for value \"{ key: 'value' }\" at path \"description\"`

      expect(response.body.message).toEqual(expected)
  })

  test('Should return 400 if completed is array', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: ['string', 'string']
      })
      .expect(400)
  })

    test('Should return 400 if completed is object', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: {key: 'value'}
      })
      .expect(400)
  })

  test('Should return specific error message in response if completed is array', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: ['string', 'string']
      })

      const expected = `Task validation failed: completed: Cast to Boolean failed for value \"[ 'string', 'string' ]\" at path \"completed\"`

      expect(response.body.message).toEqual(expected)
  })

  test('Should return specific error message in response if completed is object', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: {key: 'value'}
      })

      const expected = `Task validation failed: completed: Cast to Boolean failed for value \"{ key: 'value' }\" at path \"completed\"`

      expect(response.body.message).toEqual(expected)
  })
})