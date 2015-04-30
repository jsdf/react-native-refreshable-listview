jest.dontMock('../delay')

describe('delay', function() {
  pit('resolves after the specified time', function() {
    var delay = require('../delay')

    const DELAY_TIME = 1000

    var resolved = false
    var rejected = false

    var delayPromise = delay(DELAY_TIME)
      .then(() => resolved = true)
      .catch(() => rejected = true)
      .then(() => {
        expect(setTimeout.mock.calls.length).toBe(1)
        expect(setTimeout.mock.calls[0][1]).toBe(DELAY_TIME)
        expect(resolved).toBe(true)
        expect(rejected).toBe(false)
      })

    expect(resolved).toBe(false)
    expect(rejected).toBe(false)

    jest.runAllTimers()

    return delayPromise
  })
})
