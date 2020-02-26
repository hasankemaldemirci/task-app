const request = require('supertest')

const app = require('../src/app')

const Task = require('../src/models/task')

const { taskOne, taskTwo, validObjectId, setupDatabase } = require('./fixtures/db')

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

  test('Should NOT save empty object to database', async () => {
    await request(app)
      .post('/tasks')
      .send({})

      const tasks = await Task.find({})

      expect(tasks.length).toEqual(2)
  })

  test('Should NOT save task with empty description to database', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: ''
      })

      const task = await Task.findOne({ description: '' })

      expect(task).toBeFalsy()
  })

  test('Should ignore invalid fields', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        invalidField: true
      })

      const task = await Task.findOne({ description: 'Test task description' })

      expect(task.invalidField).toBeFalsy()
  })

  test('Should NOT save task with invalid completed property to database', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'Test task description',
        completed: 'invalid'
      })

      const task = await Task.findOne({ description: 'Test task description' })

      expect(task).toBeFalsy()
  })
})

describe('DELETE /tasks/:id', () => {
  test('Should return 200 when task is deleted', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .send()
      .expect(200)
  })

  test('Should return 204 with valid ObjectId that is not in database', async () => {
    await request(app)
      .delete(`/tasks/${validObjectId}`)
      .send()
      .expect(204)
  })

  test('Should return deleted task in response', async () => {
    const task = await Task.findById(taskOne._id)

    const expectedResponse = {
      _id: task._id.toHexString(),
      description: task.description,
      completed: task.completed
    }

    const response = await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .send()
      
      expect(response.body).toMatchObject(expectedResponse)
  })

  test('Should return 500 with invalid ObjectId', async () => {
    await request(app)
      .delete('/tasks/123456')
      .send()
      .expect(500)
  })
})

describe('GET /tasks', () => {
  test('Should return 200', async () => {
    await request(app)
      .get('/tasks')
      .send()
      .expect(200)
  })

  test('Should return array in response with valid request', async () => {
    const response = await request(app)
      .get('/tasks')
      .send()

      const actual = Array.isArray(response.body)

      expect(actual).toBe(true)
  })

  test('Should return all tasks in database', async () => {
    await request(app)
      .get('/tasks')
      .send()

      const tasks = await Task.find({})

      expect(tasks.length).toEqual(2)
  })
})

describe('GET /task/:id', () => {
  test('Should return 200 with valid ObjectId that is in database', async () => {
    await request(app)
      .get(`/tasks/${taskOne._id}`)
      .send()
      .expect(200)
  })

  test('Should return 204 with valid ObjectId that is not in database', async () => {
    await request(app)
      .get(`/tasks/${validObjectId}`)
      .send()
      .expect(204)
  })

  test('Should return 400 with invalid ObjectId', async () => {
    await request(app)
      .get('/tasks/123456')
      .send()
      .expect(400)
  })

  test('Should return specific error message with invalid ObjectId', async () => {
    const response = await request(app)
      .get('/tasks/123456')
      .send()

      const expected = 'Cast to ObjectId failed for value \"123456\" at path \"_id\" for model \"Task\"'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return correct task in response', async () => {
    const response = await request(app)
      .get(`/tasks/${taskOne._id}`)
      .send()

      const expected = {
        _id: taskOne._id.toHexString(),
        description: taskOne.description,
        completed: taskOne.completed
      }  

      expect(response.body).toMatchObject(expected)
  })
})

describe('PATCH /task/:id', () => {
  test('Should return 200', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: 'Updated task',
        completed: true
      })
      .expect(200)
  })

  test('Should return 204 with valid ObjectId that is not in database', async () => {
    await request(app)
      .patch(`/tasks/${validObjectId}`)
      .send({
        description: 'Updated task',
        completed: true
      })
      .expect(204)
  })

  test('Should return correct object in response', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: 'Updated task',
        completed: true
      })

      const expected = {
        description: 'Updated task',
        completed: true
      }

      expect(response.body).toMatchObject(expected)
  })

  test('Should return specific error message with invalid ObjectId', async () => {
    const response = await request(app)
      .patch('/tasks/123456')
      .send({
        description: 'Updated task',
        completed: true
      })

      const expected = 'Cast to ObjectId failed for value \"123456\" at path \"_id\" for model \"Task\"'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return 400 with invalid ObjectId', async () => {
    await request(app)
      .patch('/tasks/123456')
      .send({
        description: 'Updated task',
        completed: true
      })
      .expect(400)
  })

  test('Should return 400 with empty request', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send()
      .expect(400)
  })

  test('Should return specific error message with empty request', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send()

      const expected = 'Invalid updates!'

      expect(response.body.error).toEqual(expected)
  })

  test('Should return 400 with empty array', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send([])
      .expect(400)
  })

  test('Should return specific error message with empty array', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send([])

      const expected = 'Invalid updates!'

      expect(response.body.error).toEqual(expected)
  })

  test('Should return 400 with empty object', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({})
      .expect(400)
  })

  test('Should return specific error message with empty object', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({})

      const expected = 'Invalid updates!'

      expect(response.body.error).toEqual(expected)
  })

  test('Should return 400 with empty description', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: ''
      })
      .expect(400)
  })

  test('Should return specific error message with empty description', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: ''
      })

      const expected = 'Task validation failed: description: Path `description` is required.'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return updated task in response', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: 'Updated task',
        completed: true
      })

      const task = await Task.findById(taskOne._id)

      const expectedResponse = {
        _id: task._id.toHexString(),
        description: task.description,
        completed: task.completed
      }
      
      expect(response.body).toMatchObject(expectedResponse)
  })

  test('Should NOT update task if description is empty', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: ''
      })

      const task = await Task.findById(taskOne._id)

      expect(task.description).not.toEqual('')
  })

  test('Should return specific error message if description is an object type', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: {}
      })

      const expected = 'Task validation failed: description: Cast to String failed for value \"{}\" at path \"description\"'

      expect(response.body.message).toEqual(expected)
  })

  test('Should return specific error message if description is an array type', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: []
      })

      const expected = 'Task validation failed: description: Cast to String failed for value \"[]\" at path \"description\"'

      expect(response.body.message).toEqual(expected)
  })

  test('Should NOT update completed property if not sent in request', async () => {
    await request(app)
      .patch(`/tasks/${taskTwo._id}`)
      .send({
        description: 'Updated task'
      })

      const task = await Task.findById(taskTwo._id)
      expect(task.completed).toEqual(true)
  })

  test('Should trim description before saving', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: '    Updated task   '
      })

      const task = await Task.findById(taskOne._id)
      expect(task.description).toEqual('Updated task')
  })

  test('Should NOT update task if invalid fields sent in request', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: 'Updated task',
        invalidField: 'invalid'
      })

      const task = await Task.findById(taskOne._id)
      expect(task.description).not.toEqual('Updated task')
  })

  test('Should update task in database', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .send({
        description: 'Updated task',
        completed: true
      })

      const expectedTask = {
        _id: taskOne._id,
        description: 'Updated task',
        completed: true
      }

      const task = await Task.findById(taskOne._id)

      expect(task).toMatchObject(expectedTask)
  })
})