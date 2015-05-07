let createElementFrom = jest.genMockFn().mockImpl(require.requireActual('../createElementFrom'))

module.exports = createElementFrom
