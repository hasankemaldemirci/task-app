const request = require('supertest')

const app = require('../src/app')

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
})