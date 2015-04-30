jest.dontMock('../RefreshableListView')

describe('RefreshableListView', function() {
  it('can be required', function() {
    var RefreshableListView = require('../RefreshableListView')
    var listView = new RefreshableListView({})
  })
})
