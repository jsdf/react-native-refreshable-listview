jest.dontMock('../RefreshingIndicator')

describe('RefreshingIndicator', function() {
  let React
  let RefreshingIndicator

  beforeEach(function() {
    React = require.requireActual('react/addons')

    RefreshingIndicator = require('../RefreshingIndicator')

    description = "REFRESHING"
  })

  it('renders an activity indicator', function() {

    let renderer = this.shallowRender(
      <RefreshingIndicator
        description={description}
      />
    )
    let component = renderer.getComponent()

    let firstRender = renderer.getRenderOutput()
    expect(firstRender).toBeReactElement()

    let activityIndicator = component.renderActivityIndicator()
    expect(activityIndicator).toBeReactElement()
  })
})
