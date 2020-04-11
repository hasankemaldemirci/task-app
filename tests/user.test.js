const request = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../src/app')

const User = require('../src/models/user')

const { setupDatabase, disconnectFromDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)
afterAll(disconnectFromDatabase)

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

    const expectedUser = {
      name: 'Hasan',
      email: 'test@test.com'
    }

    expect(response.body).toMatchObject(expectedUser)
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

  test('Should save trimmed user name to database', async () => {
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

  test('Should NOT save user to database if email field is empty', async () => {
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

  test('Should save trimmed email to database', async () => {
    const validUser = {
      name: 'Hasan',
      email: '   test@test.com      ',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: 'test@test.com' })

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

    const user = await User.findOne({ email: 'validuser@test.com' })

    expect(user.email).toEqual('validuser@test.com')
  })

  test('Should return 400 if password length is less than 7', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '123456'
    }

    await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400)
  })

  test('Should NOT save user to database if password length is less than 7', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '123456'
    }

    await request(app)
      .post('/users')
      .send(invalidUser)

    const user = await User.findOne({ email: invalidUser.email })

    expect(user).toBeFalsy()
  })

  test('Should save user to database if password length is greater than or equal to 7', async () => {
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

  test('Should return validation error message if password length is less than 7', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '123456'
    }

    const response = await request(app)
      .post('/users')
      .send(invalidUser)

    const expectedErrorMessage = 'User validation failed: password: Path `password` (`123456`) is shorter than the minimum allowed length (7).'

    expect(response.body.message).toEqual(expectedErrorMessage)
  })

  test('Should NOT save user to database if password value contains the word "password"', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: 'password1'
    }

    await request(app)
      .post('/users')
      .send(invalidUser)

    const user = await User.findOne({ email: invalidUser.email })

    expect(user).toBeFalsy()
  })

  test('Should return validation error message if user password value contains the word "password"', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: 'password1'
    }

    const response = await request(app)
      .post('/users')
      .send(invalidUser)

    const expectedErrorMessage = 'User validation failed: password: Password value can not contain the word \"password\"'

    expect(response.body.message).toEqual(expectedErrorMessage)
  })

  test('Should save user to database with encrypted password', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: validUser.email })

    const isMatch = await bcrypt.compare(validUser.password, user.password)

    expect(isMatch).toEqual(true)
  })

  test('Should NOT return password in response', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    const response = await request(app)
      .post('/users')
      .send(validUser)

    expect(response.body.password).toBeFalsy()
  })

  test('Shound NOT return createdAt in response', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    const response = await request(app)
      .post('/users')
      .send(validUser)

    expect(response.body.createdAt).toBeFalsy()
})

test('Shound NOT return updatedAt in response', async () => {
  const validUser = {
    name: 'Hasan',
    email: 'test@test.com',
    password: '1234567'
  }

  const response = await request(app)
    .post('/users')
    .send(validUser)

  expect(response.body.updatedAt).toBeFalsy()
})

  test('Should return 400 if age is string', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: 'yas'
    }

    await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400)
  })

  test('Should save user to database if age not sent', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: 'test@test.com' })

    expect(user).toBeTruthy()
  })

  test('Should return validation error message if user age is string', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: 'yas'
    }

    const response = await request(app)
      .post('/users')
      .send(invalidUser)

    const expectedErrorMessage = 'User validation failed: age: Cast to Number failed for value \"yas\" at path \"age\"'

    expect(response.body.message).toEqual(expectedErrorMessage)
  })

  test('Should save age as 0 to database if not sent', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567'
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: validUser.email })

    expect(user.age).toEqual(0)
  })

  test('Should return 400 if user age is less than 0', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: -1
    }

    await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400)
  })

  test('Should return validation error message if user age is less than 0', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: -1
    }

    const response = await request(app)
      .post('/users')
      .send(invalidUser)

    const expectedErrorMessage = 'User validation failed: age: Age must be greater than or equal to 0'

    expect(response.body.message).toEqual(expectedErrorMessage)
  })

  test('Should NOT save user to database if age is less than 0', async () => {
    const invalidUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: -1
    }

    await request(app)
      .post('/users')
      .send(invalidUser)

    const user = await User.findOne({ email: 'test@test.com' })

    expect(user).toBeFalsy()
  })

  test('Should return 201 if user age is equal to 0', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: 0
    }

    await request(app)
      .post('/users')
      .send(validUser)
      .expect(201)
  })

  test('Should return 201 if user age is greater than 0', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: 1
    }

    await request(app)
      .post('/users')
      .send(validUser)
      .expect(201)
  })
  
  test('Should save age as null to database with empty string', async () => {
    const validUser = {
      name: 'Hasan',
      email: 'test@test.com',
      password: '1234567',
      age: ''
    }

    await request(app)
      .post('/users')
      .send(validUser)

    const user = await User.findOne({ email: validUser.email })
    
    expect(user.age).toBeNull()
  })
})