const request = require('supertest')

const app = require('../src/app')

const User = require('../src/models/user')

const { setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

describe('POST /users', () => {
  test('Should return 201 with valid user', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)
      .expect(201)
  })

  test('Should return correct response with valid user', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    const response = await request(app)
      .post('/users')
      .send(validUser)

    expect(response.body).toMatchObject(validUser)
  })

  test('Should save valid user to database', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = User.findOne({ email: validUser.email })

    expect(user).toBeTruthy()
  })
  
  test('Should return validation error message if name field is empty', async () => {
    const invalidUser = {
      name: '',
      email: 'test@test.com',
      password: '1234567'
    }

    const response = await request(app)
      .post('/users')
      .send(invalidUser)

    const expectedErrorMessage = 'User validation failed: name: Path `name` is required.'

    expect(response.body.message).toEqual(expectedErrorMessage)
  })

  test('Should trim user name before saving', async () => {
    const validUser = {
      name: '   Hasan   ',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: validUser.email })

    expect(user.name).toEqual('Hasan')
  })
})