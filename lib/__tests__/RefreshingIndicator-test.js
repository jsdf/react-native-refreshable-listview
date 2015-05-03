jest.dontMock('../RefreshingIndicator')

describe('RefreshingIndicator', function() {
  it('can be required', function() {
    var RefreshingIndicator = require('../RefreshingIndicator')
    var listView = new RefreshingIndicator({})
  })
})
