const {
  calculateTip,
  fahrenheitToCelcius,
  celciusToFahrenheit,
  add
} = require('./math')

describe('#calculateTip', () => {
  test('Should calculate total when tip provided', () => {
    const expected = 15
    const actual = calculateTip(10, .5)

    expect(actual).toBe(expected)
  })
  test('Should calculate total with .25 tip if tip not provided', () => {
    const expected = 12.5
    const actual = calculateTip(10)

    expect(actual).toBe(expected)
  })
})

describe('conversion temperature', () => {
  test('Should convert 32 F to 0 C', () => {
    const expected = 0
    const actual = fahrenheitToCelcius(32)

    expect(actual).toBe(expected)
  })
  test('Should convert 0 C to 32 F', () => {
    const expected = 32
    const actual = celciusToFahrenheit(0)

    expect(actual).toBe(expected)
  })
})

describe('#add', () => {
  test('Should add two numbers', done => {
    add(14, 14).then(actual => {
      const expected = 28
      expect(actual).toBe(expected)
      done()
    })
  })

  test('Should add two numbers async/await', async () => {
    const expected = 56
    const actual = await add(18, 38)

    expect(actual).toBe(expected)
  })

  test('Should return error message with negative numbers', done => {
    add(-18, -38).then(actual => {
      const expected = 'Numbers must be non-negative'
      expect(actual).toBe(expected)
      done()
    })
  })

  test('Should return error message with negative numbers async/await', async () => {
    const expected = 'Numbers must be non-negative'
    const actual = await add (-18, 21)

    expect(actual).toBe(expected)
  })
})