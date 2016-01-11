jest.dontMock('../RefreshingIndicator')

describe('RefreshingIndicator', function() {
  let React
  let RefreshingIndicator
  let description

  beforeEach(function() {
    React = require.requireActual('react/dist/react-with-addons')

    RefreshingIndicator = require('../RefreshingIndicator')

    description = 'REFRESHING'
  })

  it('renders an activity indicator', function() {
    let renderer = this.shallowRender(
      <RefreshingIndicator
        description={description}
      />
    )

    let rootEl = renderer.getRenderOutput()
    expect(rootEl).toBeReactElement()

    expect(
      React.Children.only(rootEl.props.children).props.children[0]
    ).toBeReactElement()
  })
})
