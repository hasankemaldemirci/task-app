const request = require('supertest')

const app = require('../src/app')

const User = require('../src/models/user')

const { setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('POST /users', () => {
  test('Should save valid user to database', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: 'test@test.com' })

    expect(user).toMatchObject(validUser)
  })
})