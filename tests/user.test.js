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

    const user = await User.findOne({ email: validUser.email })

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

  test('Should return 400 if name field is empty', async () => {
    const invalidUser = {
      name: '',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400)
  })

  test('Should return 400 if email field is empty', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: '',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400)
  })

  test('Should NOT save user if email field is empty', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: '',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(invalidUser)

    const user = await User.findOne({ email: invalidUser.email })

    expect(user).toBeFalsy()
  })

  test('Should return validation error message if email field is empty', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: '',
      password: '1234567'
    }

    const response = await request(app)
      .post('/users')
      .send(invalidUser)

    const expectedErrorMessage = 'User validation failed: email: Path `email` is required.'

    expect(response.body.message).toEqual(expectedErrorMessage)
  })

  test('Should trim email before saving', async () => {
    const validUser = {
      name: 'Hasan',
      email: '   test@test.com      ',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: validUser.email })

    expect(user.email).toEqual('test@test.com')
  })

  test('Should return validation error message if email is invalid', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test',
      password: '1234567'
    }

    const response = await request(app)
      .post('/users')
      .send(invalidUser)

    const expectedErrorMessage = 'User validation failed: email: Email is invalid!'

    expect(response.body.message).toEqual(expectedErrorMessage)
  })

  test('Should convert email to lowercase', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'VALIDUSER@TEST.COM',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: validUser.email })

    expect(user.email).toEqual('validuser@test.com')
  })
})